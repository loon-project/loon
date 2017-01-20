import {DIContainer} from "../DIContainer";
import {Metadata} from "../../metadata/Metadata";

export function Component(name?: string) {
    return (target: Function) => {
        const params = Metadata.getParams(target);
        DIContainer.registerComponent(name, target, params);
    };
}