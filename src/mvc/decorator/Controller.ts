import {ControllerRegistry} from "../ControllerRegistry";

export function Controller(baseRoute?: string) {
    return (target: Function) => {
        ControllerRegistry.registerController(target, baseRoute ? baseRoute : "");
    };
}
