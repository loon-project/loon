import {HandlerMetadata} from "./HandlerMetadata";
import * as Express from "express";
import {ParamType} from "./enum/ParamType";
import {Klass} from "../core/Klass";
import {DependencyRegistry} from "../di/DependencyRegistry";
import * as _ from "lodash";
import {ParamRequired} from "./error/ParamRequired";
import {ConverterService} from "../converter/ConverterService";
import {NextFunction} from "./interface/NextFunction";
import {Request} from './interface/Request';
import {Response} from './interface/Response';

function noop() {}

/**
 * Transform a handler to a express handler
 *
 * Support required param check, and param convert for PathParam, BodyParam, QueryParam
 *
 */
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
        if (isErrorHandler) return this.transformErrorHandler()
        return this.transformHandler()
    }

    public transformHandler(): (req, res, next) => any {
        return (req, res, next) => {
            return Promise
                .resolve()
                .then(() => this.invokeMethod(req, res, next))
                .catch(err => next(err));
        }
    }

    public transformErrorHandler(): (err, req, res) => any {
        return (err, req, res) => {
            return Promise
                .resolve()
                .then(() => this.invokeMethod(req, res, noop, err))
        };
    }

    private invokeMethod(request: Request,
                         response: Response,
                         next: NextFunction,
                         error?: Error) {

        if (response.headersSent) {
            return;
        }

        const methodName = this.handlerMetadata.actionName;

        const args: any[] = [];

        const converter = DependencyRegistry.get(ConverterService);

        this.handlerMetadata.params.forEach(param => {

            switch (param.paramType) {
                case ParamType.Path:

                    let path = _.get(request.params, param.expression);

                    if (param.required && typeof path === 'undefined') {
                        throw new ParamRequired(param.expression);
                    }

                    path = converter.convert(path, param.returnType);
                    args.push(path);
                    return;

                case ParamType.Body:

                    let body = _.get(request.body, param.expression);

                    if (param.required && typeof body === 'undefined') {
                        throw new ParamRequired(param.expression);
                    }

                    body = converter.convert(body, param.returnType);

                    args.push(body);
                    return;

                case ParamType.Query:

                    let query = _.get(request.query, param.expression);

                    if (param.required && typeof query === 'undefined') {
                        throw new ParamRequired(param.expression);
                    }

                    query = converter.convert(query, param.returnType);
                    args.push(query);
                    return;

                case ParamType.Cookie:

                    const cookie = _.get(request.cookies, param.expression);

                    if (param.required && typeof cookie === 'undefined') {
                        throw new ParamRequired(param.expression);
                    }

                    args.push(cookie);
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