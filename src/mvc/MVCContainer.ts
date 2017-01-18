import * as Express from "express";
import * as _ from "lodash";
import {MiddlewareLevel} from "./enum/MiddlewareLevel";
import {ControllerMetadata} from "./metadata/ControllerMetadata";
import {ActionMetadata} from "./metadata/ActionMetadata";
import {MiddlewareType} from "./enum/MiddlewareType";
import {ParamMetadata} from "./metadata/ParamMetadata";
import {MiddlewareMetadata} from "./metadata/MiddlewareMetadata";
import {ParamType} from "./enum/ParamType";
import {Container} from "../di/Container";
import {Response} from "./interface/Response";
import {Request} from "./interface/Request";
import {Next} from "./interface/Next";

export class MVCContainer {

    private static controllersMetadata: ControllerMetadata[] = [];
    private static paramsMetadata: ParamMetadata[] = [];
    private static actionsMetadata: ActionMetadata[] = [];
    private static middlewaresMetadata: MiddlewareMetadata[] = [];

    public static registerAction(type: Function, httpMethod: string, route: string|RegExp, actionName: string, params: any[]) {
        this.actionsMetadata.push({type, httpMethod, route, actionName, params});
    }

    public static registerController(type: Function, baseRoute?: string) {
        this.controllersMetadata.push({baseRoute: baseRoute ? baseRoute : "/", type});
    }

    public static registerMiddlewares(type: Function, middlewareLevel: MiddlewareLevel, middlewareType: MiddlewareType) {
        this.middlewaresMetadata.push({type, middlewareLevel, middlewareType});
    }

    public static registerParams(type: Function, paramType: ParamType, actionName: string, index: number, expression: string|undefined) {
        this.paramsMetadata.push({type, paramType, actionName, index, expression});
    }

    public static getRoutes() {

        return this.controllersMetadata.map(controllerMetadata => {

            const router = Express.Router();
            const type = controllerMetadata.type;
            const controller = Container.get(controllerMetadata.type);

            this.actionsMetadata
                .filter(item => item.type === type)
                .map(actionMetadata => {

                    const action = this.actionMetadataToAction(type, controller, actionMetadata);
                    const beforeActions = [];
                    const afterActions = [];
                    const renderAction = this.renderAction();

                    const actions = _.concat([], beforeActions, action, afterActions, renderAction);

                    router[actionMetadata.httpMethod](actionMetadata.route, actions);
                });

            return {baseRoute: controllerMetadata.baseRoute, router};
        });
    }

    public static actionMetadataToAction(type: Function,
                                         controller: any,
                                         actionMetadata: ActionMetadata): (request, response, next) => void {

        return (request: Request, response: Response, next: Next) => {

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

    public static invokeAction(type: Function,
                               controller: any,
                               actionMetadata: ActionMetadata,
                               request: Request,
                               response: Response,
                               next: Next) {

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

    public static renderAction() {

        return (request: Request, response: Response, next: Next) => {

            if (!response.headersSent) {

                console.log(response.data);

                switch (typeof response.data) {
                    case "number":
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
}