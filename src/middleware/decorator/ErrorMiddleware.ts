import {MiddlewareOptions} from "../MiddlewareOptions";
import {MiddlewareRegistry} from "../MiddlewareRegistry";

export function ErrorMiddleware(options?: MiddlewareOptions) {

    return (target: Function) => {

        MiddlewareRegistry.registerErrorMiddleware(target, options);

    };

}