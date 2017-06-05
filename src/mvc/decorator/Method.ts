import {ControllerRegistry} from "../ControllerRegistry";

export function Get(route: string|RegExp) {
    return (target: any, actionName: string) => {
        registerHelper(target, actionName, "get", route);
    };
}

export function Post(route: string|RegExp) {
    return (target: any, actionName: string) => {
        registerHelper(target, actionName, "post", route);
    };
}

export function Put(route: string|RegExp) {
    return (target: any, actionName: string) => {
        registerHelper(target, actionName, "put", route);
    };
}

export function Patch(route: string|RegExp) {
    return (target: any, actionName: string) => {
        registerHelper(target, actionName, "patch", route);
    };
}

export function Delete(route: string|RegExp) {
    return (target: any, actionName: string) => {
        registerHelper(target, actionName, "delete", route);
    };
}

export function Options(route: string|RegExp) {
     return (target: any, actionName: string) => {
        registerHelper(target, actionName, "options", route);
    };
}

export function All(route: string|RegExp) {
    return (target: any, actionName: string) => {
        registerHelper(target, actionName, "all", route);
    };
}

// head request should not return anything
export function Head(route: string|RegExp) {
    return (target: any, actionName: string) => {
        registerHelper(target, actionName, "head", route);
    };
}

function registerHelper(target, actionName, method, route) {
    ControllerRegistry.registerAction(target.constructor, actionName, method, route);
}






