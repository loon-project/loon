import {ParamType} from "../enum/ParamType";
import {ControllerRegistry} from "../ControllerRegistry";

export function PathParam(expression: string) {
    return (target: any, actionName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Path, actionName, index, expression);
    };
}

export function QueryParam(expression: string) {
    return (target: any, actionName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Query, actionName, index, expression);
    };
}

export function BodyParam(expression: string) {
    return (target: any, actionName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Body, actionName, index, expression);
    };
}

export function HeaderParam(expression: string) {
    return (target: any, actionName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Header, actionName, index, expression);
    };
}

export function CookieParam(expression: string) {
    return (target: any, actionName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Cookie, actionName, index, expression);
    };
}

export function SessionParam(expression: string) {
    return (target: any, actionName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Session, actionName, index, expression);
    };
}

export function Req() {
    return (target: any, actionName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Request, actionName, index, "");
    };
}

export function Res() {
    return (target: any, actionName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Response, actionName, index, "");
    };
}

export function Next() {
    return (target: any, actionName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Next, actionName, index, "");
    };
}

export function Err() {
    return (target: any, methodName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Error, methodName, index, "");
    };
}

function registerHelper(type: Function,
                        paramType: ParamType,
                        actionName: string,
                        index: number,
                        expression: string) {

    ControllerRegistry.registerParam(type, paramType, actionName, index, expression);

}

