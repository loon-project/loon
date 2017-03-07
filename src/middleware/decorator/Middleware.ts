import {MiddlewareOptions} from "../MiddlewareOptions";
import {MiddlewareRegistry} from "../MiddlewareRegistry";

export function Middleware(options?: MiddlewareOptions) {

    return (target: Function) => {
        MiddlewareRegistry.registerMiddleware(target, options);
    };

}