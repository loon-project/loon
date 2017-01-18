import {MVCContainer} from "../MVCContainer";
import {ParamType} from "../enum/ParamType";

export function PathParam(expression: string) {
    return (target: any, actionName: string, index: number) => {
        console.log(`PathParam: ${actionName} ${index}`);
        registerHelper(target.constructor, ParamType.Path, actionName, index, expression);
    };
}

export function QueryParam(expression: string) {
    return (target: any, actionName: string, index: number) => {
        console.log(`QueryParam: ${actionName} ${index}`);
        registerHelper(target.constructor, ParamType.Query, actionName, index, expression);
    };
}

export function BodyParam(expression: string) {
    return (target: any, actionName: string, index: number) => {
        console.log(`BodyParam: ${actionName} ${index}`);
        registerHelper(target.constructor, ParamType.Body, actionName, index, expression);
    };
}

export function HeaderParam(expression: string) {
    return (target: any, actionName: string, index: number) => {
        console.log(`HeaderParam: ${actionName} ${index}`);
        registerHelper(target.constructor, ParamType.Header, actionName, index, expression);
    };
}

export function CookieParam(expression: string) {
    return (target: any, actionName: string, index: number) => {
        console.log(`CookieParam: ${actionName} ${index}`);
        registerHelper(target.constructor, ParamType.Cookie, actionName, index, expression);
    };
}

export function SessionParam(expression: string) {
    return (target: any, actionName: string, index: number) => {
        console.log(`SessionParam: ${actionName} ${index}`);
        registerHelper(target.constructor, ParamType.Session, actionName, index, expression);
    };
}

export function Request() {
    return (target: any, actionName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Request, actionName, index, undefined);
    };
}

export function Response() {
    return (target: any, actionName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Response, actionName, index, undefined);
    };
}

export function Next() {
    return (target: any, actionName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Next, actionName, index, undefined);
    };
}

function registerHelper(type: Function, paramType: ParamType, actionName: string, index: number, expression: string|undefined) {
    MVCContainer.registerParams(type, paramType, actionName, index, expression);
}

