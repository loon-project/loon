import { InitializerRegistry } from "../InitializerRegistry";
import { Klass } from "../../core";

export function Initialize() {
    return (target: Klass<any>) => {
        InitializerRegistry.registerInitializer(target);
    };
}