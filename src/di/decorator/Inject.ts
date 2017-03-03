import {DependencyRegistry} from "../DependencyRegistry";

export function Inject() {
    return (target: any, key: string, index?: number) => {
        DependencyRegistry.registerHandler(target, key, index);
    };
}

