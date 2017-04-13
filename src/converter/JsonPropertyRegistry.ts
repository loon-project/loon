import {JsonPropertyMetadata} from "./JsonPropertyMetadata";
import {JsonPropertyOptions} from "./JsonPropertyOptions";
import {Reflection} from "../core/Reflection";

export class JsonPropertyRegistry {

    private static _jsonProperties: Map<Function, JsonPropertyMetadata[]> = new Map();

    public static registerJsonProperty(type: Function, propertyName: string, nameOrOptions?: string|JsonPropertyOptions) {

        const jsonProperties: JsonPropertyMetadata[] = this.findJsonProperties(type);

        let name = propertyName;
        let returnType = Reflection.getType(type, propertyName);
        let converter;

        if (nameOrOptions !== 'undefined') {

            if (nameOrOptions instanceof String) {

                name = nameOrOptions;

            } else {

                const options = <JsonPropertyOptions> nameOrOptions;

                if (typeof options.name !== 'undefined') {
                    name = options.name;
                }

                if (typeof options.returnType !== 'undefined') {
                    returnType = options.returnType;
                }

                if (typeof options.converter !== 'undefined') {
                    converter = options.converter;
                }

            }
        }

        const jsonProperty = new JsonPropertyMetadata(type, name, returnType, converter);

        jsonProperties.push(jsonProperty);
    }

    private static findJsonProperties(type: Function) {

        let jsonProperties = this._jsonProperties.get(type);

        if (typeof jsonProperties === 'undefined') {
            jsonProperties = [];
            this._jsonProperties.set(type, jsonProperties);
        }

        return jsonProperties;
    }

}