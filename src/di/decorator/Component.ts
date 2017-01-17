import {Container} from "../Container";
import {Metadata} from "../../metadata/Metadata";

export function Component(name?: string) {
    return (target: Function) => {
        const params = Metadata.getParams(target);
        Container.registerComponent(name, target, params);
    };
}