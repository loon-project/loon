import { PropertyRegistry } from "../PropertyRegistry";
import { Klass } from "../../core";

export function PropertyInherited(inherited: Klass) {
    return (target: Klass) => {
        PropertyRegistry.registerInherited(target, inherited);
    };
}