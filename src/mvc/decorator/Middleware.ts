import {MiddlewareRegistry} from "../MiddlewareRegistry";
import {MiddlewareOptions} from "../MiddlewareOptions";


export function Middleware(options?: MiddlewareOptions) {
    return (target: any) => {
        MiddlewareRegistry.registerMiddleware(target, false, options);
    };
}

export function ErrorMiddleware(options?: MiddlewareOptions) {
    return (target: any) => {
        MiddlewareRegistry.registerMiddleware(target, true, options);
    };
}
