import {PropertyMetadata} from "./PropertyMetadata";
import {PropertyOptions} from "./PropertyOptions";
import {Reflection} from "../core/Reflection";
import * as _ from 'lodash';
import {DependencyRegistry} from "../di/DependencyRegistry";
import {Klass} from "../core/Klass";

export class PropertyRegistry {

    public static properties: Map<Function, PropertyMetadata[]> = new Map();


    public static registerObjectProperty(type: Klass, klassProperty: string, nameOrOptions?: string|PropertyOptions) {
        const properties = this.findProperties(type);

        const propertyType = <Klass>Reflection.getType(type.prototype, klassProperty);

        let objectProperty = klassProperty;
        let converter;
        let baseType;
        let serialize = true;
        let deserialize = true;

        if (typeof nameOrOptions !== 'undefined') {

            if (_.isString(nameOrOptions)) {

                objectProperty = nameOrOptions;

            } else {

                const options = <PropertyOptions> nameOrOptions;

                if (typeof options.name !== 'undefined') {
                    objectProperty = options.name;
                }

                if (typeof options.converter !== 'undefined') {
                    converter = DependencyRegistry.get(<Klass> options.converter);
                }

                if (typeof options.baseType !== 'undefined') {
                    baseType = options.baseType;
                }

                if (typeof options.serialize !== 'undefined') {
                    serialize = options.serialize;
                }

                if (typeof options.deserialize !== 'undefined') {
                    deserialize = options.deserialize;
                }

            }
        }

        const propertyMetadata = new PropertyMetadata(type, klassProperty, objectProperty, propertyType, serialize, deserialize);

        if (converter) {
            propertyMetadata.converter = converter;
        }

        if (baseType) {
            propertyMetadata.baseType = baseType;
        }

        properties.push(propertyMetadata);
    }

    public static registerInherited(type: Klass, inherited: Klass) {
        const inheritedProperties = this.findProperties(inherited);
        const properties = this.findProperties(type);

        inheritedProperties.forEach((property: PropertyMetadata) => {
            const foundProperty = properties.find(item => item.klassProperty === property.klassProperty);

            if (typeof foundProperty === 'undefined') {
                properties.push(property);
            }
        });
    }

    public static findProperties(type: Klass) {
        let properties = this.properties.get(type);

        if (typeof properties === 'undefined') {
            properties = [];
            this.properties.set(type, properties);
        }

        return properties;
    }
}