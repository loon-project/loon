import * as Express from "express";
import * as _ from "lodash";
import {MiddlewareLevel} from "./enum/MiddlewareLevel";
import {ControllerMetadata} from "./metadata/ControllerMetadata";
import {ActionMetadata} from "./metadata/ActionMetadata";
import {MiddlewareType} from "./enum/MiddlewareType";
import {ParamMetadata} from "./metadata/ParamMetadata";
import {MiddlewareMetadata} from "./metadata/MiddlewareMetadata";
import {ParamType} from "./enum/ParamType";
import {DIContainer} from "../di/DIContainer";
import {Middleware} from "./interface/Middleware";
import {TypedResponse} from "./interface/TypedResponse";
import {TypedNext} from "./interface/TypedNext";
import {TypedRequest} from "./interface/TypedRequest";

export class MVCContainer {

    private static controllersMetadata: ControllerMetadata[] = [];
    private static paramsMetadata: ParamMetadata[] = [];
    private static actionsMetadata: ActionMetadata[] = [];
    private static middlewaresMetadata: MiddlewareMetadata[] = [];

    public static registerAction(type: Function, httpMethod: string, route: string|RegExp, actionName: string, params: any[]) {
        this.actionsMetadata.push({type, httpMethod, route, actionName, params});
    }

    public static registerController(type: Function, baseRoute: string, isRest: boolean) {
        this.controllersMetadata.push({
            baseRoute,
            type,
            isRest
        });
    }

    public static registerMiddlewares(type: Function,
                                      middleware: new (...args) => Middleware,
                                      middlewareLevel: MiddlewareLevel,
                                      middlewareType: MiddlewareType,
                                      actionName?: string) {

        this.middlewaresMetadata.push({type, middleware, middlewareLevel, middlewareType, actionName});
    }

    public static registerParams(type: Function, paramType: ParamType, actionName: string, index: number, expression: string) {
        this.paramsMetadata.push({type, paramType, actionName, index, expression});
    }

    public static getRoutes(): {baseRoute: string, router: Express.Router}[] {

        return this.controllersMetadata.map(controllerMetadata => {

            const router = Express.Router();
            const type = controllerMetadata.type;
            const controller = DIContainer.get(controllerMetadata.type);

            this.actionsMetadata
                .filter(item => item.type === type)
                .map(actionMetadata => {

                    const action = this.actionMetadataToAction(type, controller, actionMetadata);

                    const controllerBeforeActions = this.middlewaresMetadata
                        .filter(item => item.type === type
                                        && item.middlewareLevel === MiddlewareLevel.Controller
                                        && item.middlewareType === MiddlewareType.BeforeAction)
                        .map(item => this.wrapMiddleware(DIContainer.get(item.middleware).use));

                    const actionBeforeActions = this.middlewaresMetadata
                        .filter(item => item.type === type
                                        && item.middlewareLevel === MiddlewareLevel.Action
                                        && item.middlewareType === MiddlewareType.BeforeAction)
                        .map(item => this.wrapMiddleware(DIContainer.get(item.middleware).use));

                    const controllerAfterActions = this.middlewaresMetadata
                        .filter(item => item.type === type
                                        && item.middlewareLevel === MiddlewareLevel.Controller
                                        && item.middlewareType === MiddlewareType.AfterAction)
                        .map(item => this.wrapMiddleware(DIContainer.get(item.middleware).use));

                    const actionAfterActions = this.middlewaresMetadata
                        .filter(item => item.type === type && item.middlewareLevel === MiddlewareLevel.Action && item.middlewareType === MiddlewareType.AfterAction)
                        .map(item => this.wrapMiddleware(DIContainer.get(item.middleware).use));

                   let renderAction;

                    if (controllerMetadata.isRest) {
                        renderAction = this.renderRestAction();
                    } else {
                        renderAction = this.renderPageAction();
                    }

                    const actions = _.concat([], controllerBeforeActions, actionBeforeActions, action,  controllerAfterActions, actionAfterActions, renderAction);

                    router[actionMetadata.httpMethod](actionMetadata.route, actions);
                });

            return {baseRoute: controllerMetadata.baseRoute, router};
        });
    }

    public static actionMetadataToAction(type: Function,
                                         controller: any,
                                         actionMetadata: ActionMetadata): (request, response, next) => void {

        return (request: TypedRequest, response: TypedResponse, next: TypedNext) => {

            response.setHeader('X-Powered-By', 'Typed Framework');

            return new Promise((resolve, reject) => {

                const result = this.invokeAction(type, controller, actionMetadata, request, response, next);

                if (result && result.then) {
                    result.then(resolve, reject);
                } else {
                    resolve(result);
                }

            })
                .then(data => {
                    response.data = data;
                    next();
                })
                .catch(err => next(err));
        };
    }

    public static wrapMiddleware(middleware: Function) {
        return (req: TypedRequest, res: TypedResponse, next: TypedNext) => {
            try {
                return middleware(req, res, next);
            } catch (err) {
                return next(err);
            }

        };
    }

    public static invokeAction(type: Function,
                               controller: any,
                               actionMetadata: ActionMetadata,
                               request: Express.Request,
                               response: Express.Response,
                               next: Express.NextFunction) {

        const params = actionMetadata.params;
        const actionName = actionMetadata.actionName;
        const paramsMetadata = this.paramsMetadata.filter(item => item.type === type).filter(item => item.actionName === actionName);

        const args = params.map((param, index) => {
            const paramMetadata = paramsMetadata.find(item => item.index === index);

            if (paramMetadata) {
                switch (paramMetadata.paramType) {
                    case ParamType.Body:
                        return _.get(request.body, paramMetadata.expression);
                    case ParamType.Cookie:
                        return _.get(request.cookies, paramMetadata.expression);
                    case ParamType.Path:
                        return _.get(request.params, paramMetadata.expression);
                    case ParamType.Query:
                        return _.get(request.query, paramMetadata.expression);
                    case ParamType.Header:
                        return request.header(paramMetadata.expression ? paramMetadata.expression : "");
                    case ParamType.Request:
                        return request;
                    case ParamType.Response:
                        return response;
                    case ParamType.Next:
                        return next;
                    default:
                        return undefined;
                }
            }

            return undefined;
        });

        return controller[actionName].apply(controller, args);
    }

    public static renderRestAction() {

        return (request: TypedRequest, response: TypedResponse, next: TypedNext) => {

            if (!response.headersSent) {

                if (request.method === 'POST') {
                    response.status(201);
                }

                switch (typeof response.data) {
                    case "number":
                        response.send(response.data.toString());
                        break;
                    case "boolean":
                    case "string":
                    case "undefined":
                        response.send(response.data);
                        break;
                    default:
                        response.json(response.data);
                }

            }
        };
    }

    public static renderPageAction() {

         return (request: TypedRequest, response: TypedResponse, next: TypedNext) => {

            if (!response.headersSent) {

                if (request.method === 'POST') {
                    response.status(201);
                }

                response.render(response.data);
            }
        };
    }
}