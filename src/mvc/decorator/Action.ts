import {Middleware} from "../interface/IMiddleware";
import {MVCContainer} from "../MVCContainer";
import {MiddlewareLevel} from "../enum/MiddlewareLevel";
import {MiddlewareType} from "../enum/MiddlewareType";
import {ControllerRegistry} from "../ControllerRegistry";

export function BeforeAction(MiddlewareClass: new (...args) => Middleware): Function {

    return (target: any, actionName?: string) => {

        if (actionName) {

            MVCContainer.registerMiddlewares(target.constructor, MiddlewareClass, MiddlewareLevel.Action, MiddlewareType.BeforeAction, actionName);
            ControllerRegistry.registerActionHook(target.constructor, MiddlewareClass, MiddlewareLevel.Action, MiddlewareType.BeforeAction, actionName);

        } else {

            MVCContainer.registerMiddlewares(target, MiddlewareClass, MiddlewareLevel.Controller, MiddlewareType.BeforeAction);
            ControllerRegistry.registerActionHook(target, MiddlewareClass, MiddlewareLevel.Controller, MiddlewareType.BeforeAction);
        }

    };
}

export function AfterAction(MiddlewareClass: new (...args) => Middleware): Function {
    return (target: any, actionName?: string) => {

        if (actionName) {

            MVCContainer.registerMiddlewares(target.constructor, MiddlewareClass, MiddlewareLevel.Action, MiddlewareType.AfterAction, actionName);
            ControllerRegistry.registerActionHook(target.constructor, MiddlewareClass, MiddlewareLevel.Action, MiddlewareType.AfterAction, actionName);

        } else {

            MVCContainer.registerMiddlewares(target, MiddlewareClass, MiddlewareLevel.Controller, MiddlewareType.AfterAction);
            ControllerRegistry.registerActionHook(target, MiddlewareClass, MiddlewareLevel.Controller, MiddlewareType.AfterAction);
        }
    };
}

export function ErrorAction(middlewareType: Function): Function {

    return (target: any, actionName?: string) => {

        if (actionName) {

            ControllerRegistry.registerActionHook(target.constructor, middlewareType, MiddlewareLevel.Action, MiddlewareType.ErrorAction, actionName);

        } else {

            ControllerRegistry.registerActionHook(target, middlewareType, MiddlewareLevel.Controller, MiddlewareType.ErrorAction);

        }

    };
}



