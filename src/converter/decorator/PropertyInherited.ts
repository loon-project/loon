import {PropertyRegistry} from "../PropertyRegistry";

export function PropertyInherited(inherited: Function) {

    return (target: Function) => {

        PropertyRegistry.registerInherited(target, inherited);
    };
}