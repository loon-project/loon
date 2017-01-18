import {Container} from "../../di/Container";
import {ParamTypes, Metadata} from "../../metadata/Metadata";
import {MVCContainer} from "../MVCContainer";

export function Controller(baseRoute?: string) {
    return (target: Function) => {
        const params = Metadata.getParams(target);
        Container.registerComponent(undefined, target, params);
        MVCContainer.registerController(target, baseRoute);
    };
}

export function RestController(baseRoute?: string) {
    return (target: Function) => {
    };
}