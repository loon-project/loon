import {Middleware} from "../interface/IMiddleware";
import {MVCContainer} from "../MVCContainer";
import {MiddlewareLevel} from "../enum/MiddlewareLevel";
import {MiddlewareType} from "../enum/MiddlewareType";

export function BeforeAction(MiddlewareClass: new (...args) => Middleware): Function {

    return (target: any, actionName?: string) => {

        if (actionName) {

            MVCContainer.registerMiddlewares(target.constructor, MiddlewareClass, MiddlewareLevel.Action, MiddlewareType.BeforeAction, actionName);

        } else {

            MVCContainer.registerMiddlewares(target, MiddlewareClass, MiddlewareLevel.Controller, MiddlewareType.BeforeAction);
        }

    };
}

export function AfterAction(MiddlewareClass: new (...args) => Middleware): Function {
    return (target: any, actionName?: string) => {

        if (actionName) {

            MVCContainer.registerMiddlewares(target.constructor, MiddlewareClass, MiddlewareLevel.Action, MiddlewareType.AfterAction, actionName);

        } else {

            MVCContainer.registerMiddlewares(target, MiddlewareClass, MiddlewareLevel.Controller, MiddlewareType.AfterAction);
        }
    };
}



