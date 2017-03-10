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



export function ErrorHandler() {
    return (target: any) => {
    };
}

// export function GlobalErrorMiddleware() {
//     return (target: any) => {
//         ControllerRegistry.registerMiddleware(target, true, true);
//     };
// }

// export function ErrorMiddleware() {
//     return (target: any) => {
//         ControllerRegistry.registerMiddleware(target, false, true);
//     };
// }
