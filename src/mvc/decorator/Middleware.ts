import {ControllerRegistry} from "../ControllerRegistry";


export function GlobalMiddleware() {
    return (target: any) => {
        ControllerRegistry.registerMiddleware(target, true, false);
    };
}

export function GlobalErrorMiddleware() {
    return (target: any) => {
        ControllerRegistry.registerMiddleware(target, true, true);
    };
}

export function Middleware() {
    return (target: any) => {
        ControllerRegistry.registerMiddleware(target, false, false);
    };
}

export function ErrorMiddleware() {
    return (target: any) => {
        ControllerRegistry.registerMiddleware(target, false, true);
    };
}


