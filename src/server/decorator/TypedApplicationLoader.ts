import {TypedApplicationOption} from "../TypedApplicationOption";
import {ServerContainer} from "../ServerContainer";

export function TypedApplicationLoader(options?: TypedApplicationOption) {

    return (klass: Function) => {
        ServerContainer.registerApplication(klass, options);
    };
}