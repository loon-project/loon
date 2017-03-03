import {TypedApplicationOption} from "../TypedApplicationOption";
import {ServerContainer} from "../ServerContainer";

export function Use(...args: any[]) {

    return (klass: Function) => {
        ServerContainer.registerApplication(klass, options);
    };
}