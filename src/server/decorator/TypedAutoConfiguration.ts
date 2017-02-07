import {TypedApplicationOption} from "../TypedApplicationOption";
import {ServerContainer} from "../ServerContainer";

export function TypedAutoConfiguration(options?: TypedApplicationOption) {

    return (target: Function) => {

        ServerContainer.registerApplication(target, options);

    };

}