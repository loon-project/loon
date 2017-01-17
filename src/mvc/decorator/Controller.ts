import {Container} from "../../di/Container";
import {ParamTypes, Metadata} from "../../metadata/Metadata";
import {HttpContainer} from "../HttpContainer";

export function Controller(baseRoute?: string) {
    return (target: Function) => {
        const params = Metadata.getParams(target);
        Container.registerComponent(undefined, target, params);
        if (!baseRoute) {
            baseRoute = "";
        }
        HttpContainer.registerController(baseRoute, target);
    };
}

export function RestController(baseRoute?: string) {
    return (target: Function) => {
    };
}