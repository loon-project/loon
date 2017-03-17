import {HandlerMetadata} from "./HandlerMetadata";
import * as Express from 'express';
import {ParamType} from "./enum/ParamType";
import {Klass} from "../core/Klass";
import {DependencyRegistry} from "../di/DependencyRegistry";
import * as _ from 'lodash';
import {ParamRequired} from "./error/ParamRequired";

export class HandlerTransformer {

    private _handlerMetadata: HandlerMetadata;

    get handlerMetadata(): HandlerMetadata {
        return this._handlerMetadata;
    }

    constructor(handlerMetadata: HandlerMetadata) {
        this._handlerMetadata = handlerMetadata;
    }

    public transform() {

        const isErrorHandler = this.handlerMetadata.isErrorHandler;

        if (isErrorHandler) {

            return (err: any, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {

                return Promise
                    .resolve()
                    .then(() => this.invokeMethod(req, res, next, err))
                    .catch(err => next(err));
            };

        } else {

            return (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {

                return Promise
                    .resolve()
                    .then(() => this.invokeMethod(req, res, next))
                    .catch(err => next(err));
            };
        }

    }

    private invokeMethod(request: Express.Request,
                         response: Express.Response,
                         next: Express.NextFunction,
                         error?: Error) {

        if (response.headersSent) {
            return;
        }

        const methodName = this.handlerMetadata.actionName;

        const args: any[] = [];

        this.handlerMetadata.params.forEach(param => {

            switch (param.paramType) {
                case ParamType.Body:

                    const body = _.get(request.body, param.expression);

                    if (param.required && typeof body === 'undefined') {
                        throw new ParamRequired(param.expression);
                    }

                    args.push(body);
                    return;
                case ParamType.Cookie:

                    const cookie = _.get(request.cookies, param.expression);

                    if (param.required && typeof cookie === 'undefined') {
                        throw new ParamRequired(param.expression);
                    }

                    args.push(cookie);
                    return;
                case ParamType.Path:

                    const path = _.get(request.params, param.expression);

                    if (param.required && typeof path === 'undefined') {
                        throw new ParamRequired(param.expression);
                    }

                    args.push(path);
                    return;

                case ParamType.Query:

                    const query = _.get(request.query, param.expression);

                    if (param.required && typeof query === 'undefined') {
                        throw new ParamRequired(param.expression);
                    }

                    args.push(query);
                    return;

                case ParamType.Header:

                    const header = request.header(param.expression);

                    if (param.required && typeof header === 'undefined') {
                        throw new ParamRequired(param.expression);
                    }

                    args.push(header);
                    return;

                case ParamType.Error:

                    args.push(error);
                    return;

                case ParamType.Request:

                    args.push(request);
                    return;

                case ParamType.Response:

                    args.push(response);
                    return;

                case ParamType.Next:

                    args.push(next);
                    return;

                case ParamType.Data:

                    args.push(response.locals);
                    return;

                default:
                    args.push(undefined);
                    return;
            }

        });


        const handlerKlass = <Klass>this.handlerMetadata.type;

        const handlerInstance = DependencyRegistry.get(handlerKlass);

        return handlerInstance[methodName].apply(handlerInstance, args);
    }
}