import { DependencyRegistry } from "../DependencyRegistry";
import { Klass } from "../../core/Klass";

export function Component() {
    return (klass: Klass) => {
        DependencyRegistry.registerComponent(klass);
    };
}