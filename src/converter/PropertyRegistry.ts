import {PropertyMetadata} from "./PropertyMetadata";
import {PropertyOptions} from "./PropertyOptions";
import {Reflection} from "../core/Reflection";
import * as _ from 'lodash';

export class PropertyRegistry {

    public static properties: Map<Function, PropertyMetadata[]> = new Map();


    public static registerObjectProperty(type: Function, klassProperty: string, nameOrOptions?: string|PropertyOptions) {
        const properties = this.findProperties(type);

        const propertyType = Reflection.getType(type.prototype, klassProperty);

        let objectProperty = klassProperty;
        let converter;
        let baseType;

        if (typeof nameOrOptions !== 'undefined') {

            if (_.isString(nameOrOptions)) {

                objectProperty = nameOrOptions;

            } else {

                const options = <PropertyOptions> nameOrOptions;

                if (typeof options.name !== 'undefined') {
                    objectProperty = options.name;
                }

                if (typeof options.converter !== 'undefined') {
                    converter = options.converter;
                }

                if (typeof options.baseType !== 'undefined') {
                    baseType = options.baseType;
                }

            }
        }

        const propertyMetadata = new PropertyMetadata(type, klassProperty, objectProperty, propertyType);

        if (converter) {
            propertyMetadata.converter = converter;
        }

        if (baseType) {
            propertyMetadata.baseType = baseType;
        }

        properties.push(propertyMetadata);
    }

    public static findProperties(type: Function) {
        let properties = this.properties.get(type);

        if (typeof properties === 'undefined') {
            properties = [];
            this.properties.set(type, properties);
        }

        return properties;
    }
}