import {JsonPropertyMetadata} from "./JsonPropertyMetadata";
import {JsonPropertyOptions} from "./JsonPropertyOptions";
import {Reflection} from "../core/Reflection";
import {JsonSourceMetadata} from "./JsonSourceMetadata";

export class JsonPropertyRegistry {

    private static _jsonSources: Map<Function, JsonSourceMetadata> = new Map();

    public static jsonSources = JsonPropertyRegistry._jsonSources;

    public static registerJsonProperty(type: Function, propertyName: string, nameOrOptions?: string|JsonPropertyOptions) {

        const jsonSource: JsonSourceMetadata = this.findJsonSource(type);

        let name = propertyName;
        let returnType = Reflection.getType(type.prototype, propertyName);
        let converter;

        if (typeof nameOrOptions !== 'undefined') {

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

        jsonSource.properties.set(name, jsonProperty);
    }

    private static findJsonSource(type: Function) {

        let jsonSource = this._jsonSources.get(type);

        if (typeof jsonSource === 'undefined') {
            jsonSource = new JsonSourceMetadata();
            this._jsonSources.set(type, jsonSource);
        }

        return jsonSource;
    }

}