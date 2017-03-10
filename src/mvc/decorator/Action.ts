import {MiddlewareLevel} from "../enum/MiddlewareLevel";
import {MiddlewareType} from "../enum/MiddlewareType";
import {ControllerRegistry} from "../ControllerRegistry";
import {ArgumentError} from "../../core/error/ArgumentError";

export function BeforeAction(middlewareType: Function): Function {

    return (target: any, actionName?: string) => {

        if (actionName) {
            ControllerRegistry.registerActionHook(target.constructor, middlewareType, MiddlewareLevel.Action, MiddlewareType.BeforeAction, actionName);
        } else {
            ControllerRegistry.registerActionHook(target, middlewareType, MiddlewareLevel.Controller, MiddlewareType.BeforeAction);
        }

    };
}

export function AfterAction(middlewareType: Function): Function {
    return (target: any, actionName?: string) => {

        if (actionName) {
            ControllerRegistry.registerActionHook(target.constructor, middlewareType, MiddlewareLevel.Action, MiddlewareType.AfterAction, actionName);
        } else {
            ControllerRegistry.registerActionHook(target, middlewareType, MiddlewareLevel.Controller, MiddlewareType.AfterAction);
        }
    };
}

export function ErrorAction(middlewareType: Function): Function {

    return (target: any, actionName?: string) => {

        if (actionName) {
            throw new ArgumentError('action level error handler is not allowed');
        } else {
            ControllerRegistry.registerActionHook(target, middlewareType, MiddlewareLevel.Controller, MiddlewareType.ErrorAction);
        }

    };
}



