import {TypedDependencyRegistry} from "../TypedDependencyRegistry";

export function Inject() {
    return (target: any, key: string, index?: number) => {
        TypedDependencyRegistry.registerHandler(target, key, index);
    };
}

