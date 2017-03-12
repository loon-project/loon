import {MiddlewareRegistry} from "../MiddlewareRegistry";


export function GlobalMiddleware() {
    return (target: any) => {
        MiddlewareRegistry.registerMiddleware(target, true);
    };
}

export function Middleware() {
    return (target: any) => {
        MiddlewareRegistry.registerMiddleware(target, false);
    };
}
