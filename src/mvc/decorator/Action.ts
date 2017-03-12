import {ControllerRegistry} from "../ControllerRegistry";
import {ActionHookType} from "../enum/ActionHookType";

export function BeforeAction(middlewareType: Function): Function {

    return (target: any) => {
        ControllerRegistry.registerActionHook(target, middlewareType, ActionHookType.BeforeAction);
    };
}

export function AfterAction(middlewareType: Function): Function {
    return (target: any) => {
        ControllerRegistry.registerActionHook(target, middlewareType, ActionHookType.AfterAction);
    };
}

