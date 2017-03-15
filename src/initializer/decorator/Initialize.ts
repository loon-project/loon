import {InitializerRegistry} from "../InitializerRegistry";

export function Initialize() {
    return (target: any) => {
        InitializerRegistry.registerInitializer(target);
    };
}