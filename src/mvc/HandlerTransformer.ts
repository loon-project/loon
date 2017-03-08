import {HandlerMetadata} from "./HandlerMetadata";
import * as Express from 'express';
import {ParamType} from "./enum/ParamType";
import {Klass} from "../core/Klass";
import {DependencyRegistry} from "../di/DependencyRegistry";
import * as _ from 'lodash';

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

            return (err: Error, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {

                return new Promise((resolve, reject) => {

                        const result = this.invokeMethod(req, res, next, err);

                        if (result && result.then) {
                            result.then(resolve, reject);
                        } else {
                            resolve(result);
                        }

                    })
                    .catch(err => next(err));
            };

        } else {

            return (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {

                return new Promise((resolve, reject) => {

                        const result = this.invokeMethod(req, res, next);

                        if (result && result.then) {
                            result.then(resolve, reject);
                        } else {
                            resolve(result);
                        }

                    })
                    .catch(err => next(err));
            };
        }

    }

    private invokeMethod(
        request: Express.Request,
        response: Express.Response,
        next: Express.NextFunction,
        error?: Error
    ) {

        if (response.headersSent) {
            return;
        }

        const methodName = this.handlerMetadata.actionName;

        const args: any[] = [];

        this.handlerMetadata.params.forEach(param => {

            switch (param.paramType) {
                case ParamType.Body:
                    args.push(_.get(request.body, param.expression));
                    return;
                case ParamType.Cookie:
                    args.push(_.get(request.cookies, param.expression));
                    return;
                case ParamType.Path:
                    args.push(_.get(request.params, param.expression));
                    return;
                case ParamType.Query:
                    args.push(_.get(request.query, param.expression))
                    return;
                case ParamType.Header:
                    args.push(request.header(param.expression ? param.expression : ""))
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