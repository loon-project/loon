import {JsonPropertyOptions} from "../JsonPropertyOptions";
import {JsonPropertyRegistry} from "../JsonPropertyRegistry";

export function JsonProperty(nameOrOption?: string|JsonPropertyOptions) {

    return (target: any, propertyName: string) => {

        JsonPropertyRegistry.registerJsonProperty(target.constructor, propertyName, nameOrOption);

    };

}