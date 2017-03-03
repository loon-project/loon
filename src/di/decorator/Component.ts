import {DependencyRegistry} from "../DependencyRegistry";
import {Klass} from "../../core/Klass";

export function Component() {
    return (klass: Klass) => {
        console.log(klass.name);
        DependencyRegistry.registerComponent(klass);
    };
}