import {MiddlewareLevel} from "../enum/MiddlewareLevel";
import {MiddlewareType} from "../enum/MiddlewareType";
import {Middleware} from "../interface/IMiddleware";

export interface MiddlewareMetadata {

    type: Function;

    middleware: new (...args) => Middleware;

    middlewareLevel: MiddlewareLevel;

    middlewareType: MiddlewareType;

    actionName?: string;

}