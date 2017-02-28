import {TypedDependencyRegistry} from "../TypedDependencyRegistry";
import {Klass} from "../../core/Klass";

export function Component() {
    return (klass: Klass) => {
        console.log(klass.name);
        TypedDependencyRegistry.registerComponent(klass);
    };
}