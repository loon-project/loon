import {JsonPropertyMetadata} from "./JsonPropertyMetadata";
import {JsonPropertyOptions} from "./JsonPropertyOptions";
import {Reflection} from "../core/Reflection";
import * as _ from "lodash";

const JsonSupportType = [Number, String, Boolean, Array, null, Object];

export class JsonPropertyRegistry {

    private static _jsonProperties: Map<Function, JsonPropertyMetadata[]> = new Map();

    public static jsonProperties = JsonPropertyRegistry._jsonProperties;

    public static registerJsonProperty(type: Function, propertyName: string, nameOrOptions?: string|JsonPropertyOptions) {

        const jsonProperties: JsonPropertyMetadata[] = this.findJsonProperties(type);

        const propertyType = Reflection.getType(type.prototype, propertyName);

        let jsonName = propertyName;
        let jsonType = propertyType;
        let converter;


        if (typeof nameOrOptions !== 'undefined') {

            if (_.isString(nameOrOptions)) {

                jsonName = nameOrOptions;

            } else {

                const options = <JsonPropertyOptions> nameOrOptions;

                if (typeof options.name !== 'undefined') {
                    jsonName = options.name;
                }

                if (typeof options.type !== 'undefined') {
                    jsonType = options.type;
                }

                if (typeof options.converter !== 'undefined') {
                    converter = options.converter;
                }

            }
        }

        const jsonProperty = new JsonPropertyMetadata(type, jsonName, jsonType, propertyName, propertyType);

        if (typeof converter !== 'undefined') {
            jsonProperty.converter = converter;
        }

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