import {MiddlewareRegistry} from "../MiddlewareRegistry";


export function Middleware(baseUrl?: string) {
    return (target: any) => {
        MiddlewareRegistry.registerMiddleware(target, {baseUrl, isError: false});
    };
}

export function ErrorMiddleware(baseUrl?: string) {
    return (target: any) => {
        MiddlewareRegistry.registerMiddleware(target, {baseUrl, isError: true});
    };
}
