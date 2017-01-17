import {HttpContainer} from "../HttpContainer";

export function Get(route: string|RegExp) {
    return (target: any, key: string) => {
        console.log(`Get: ${key} ${route}`);
        HttpContainer.registerAction("get", route, target, key);
    };
}

export function Post(route: string|RegExp) {
    return (target: any, key: string) => {
        console.log(`Get: ${key} ${route}`);
        HttpContainer.registerAction("post", route, target, key);
    };
}

export function Put(route: string|RegExp) {
    return (target: any, key: string) => {
        console.log(`Get: ${key} ${route}`);
        HttpContainer.registerAction("put", route, target, key);
    };
}

export function Patch(route: string|RegExp) {
    return (target: any, key: string) => {
        console.log(`Get: ${key} ${route}`);
        HttpContainer.registerAction("patch", route, target, key);
    };
}

export function Delete(route: string|RegExp) {
    return (target: any, key: string) => {
        console.log(`Get: ${key} ${route}`);
        HttpContainer.registerAction("delete", route, target, key);
    };
}






