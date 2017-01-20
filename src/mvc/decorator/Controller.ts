import {DIContainer} from "../../di/DIContainer";
import {ParamTypes, Metadata} from "../../metadata/Metadata";
import {MVCContainer} from "../MVCContainer";

export function Controller(baseRoute?: string) {
    return (target: Function) => {
        const params = Metadata.getParams(target);
        DIContainer.registerComponent(undefined, target, params);
        MVCContainer.registerController(target, baseRoute);
    };
}

export function RestController(baseRoute?: string) {
    return (target: Function) => {
    };
}