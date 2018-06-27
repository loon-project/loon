import {ControllerRegistry} from "../ControllerRegistry";

export function Controller(baseRoute?: string) {
    return (target: Function) => {
        ControllerRegistry.registerController(target, baseRoute ? baseRoute : "", false);
    };
}

export function RestController(baseRoute?: string) {
    return (target: Function) => {
        ControllerRegistry.registerController(target, baseRoute ? baseRoute : "", true);
    };
}