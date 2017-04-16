import {PropertyRegistry} from "../PropertyRegistry";
import {PropertyOptions} from "../PropertyOptions";

export function ObjectProperty(nameOrOptions?: string|PropertyOptions) {

    return (target: any, propertyName: string) => {

        PropertyRegistry.registerObjectProperty(target.constructor, propertyName, nameOrOptions);

    };

}