import {ControllerRegistry} from "../ControllerRegistry";


export function GlobalMiddleware() {
    return (target: any) => {
        ControllerRegistry.registerMiddleware(target, true);
    };
}

export function Middleware() {
    return (target: any) => {
        ControllerRegistry.registerMiddleware(target, false);
    };
}
