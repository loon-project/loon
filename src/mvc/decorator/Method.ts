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

function registerHelper(target, actionName, method, route) {
    ControllerRegistry.registerAction(target.constructor, actionName, method, route);
}






