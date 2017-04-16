import {PropertyMetadata} from "./PropertyMetadata";
import {PropertyOptions} from "./PropertyOptions";
import {Reflection} from "../core/Reflection";
import * as _ from 'lodash';

export class PropertyRegistry {

    public static objectProperties: Map<Function, Map<string, PropertyMetadata>> = new Map();
    public static klassProperties: Map<Function, Map<string, PropertyMetadata>> = new Map();


    public static registerObjectProperty(type: Function, klassProperty: string, nameOrOptions?: string|PropertyOptions) {
        this.initProperties(type);

        const propertyType = Reflection.getType(type.prototype, klassProperty);

        let objectProperty = klassProperty;
        let converter;

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

            }
        }

        const propertyMetadata = new PropertyMetadata(type, klassProperty, objectProperty, propertyType);

        if (typeof converter !== 'undefined') {
            propertyMetadata.converter = converter;
        }

        (<any> this.objectProperties.get(type)).set(objectProperty, propertyMetadata);
        (<any> this.klassProperties.get(type)).set(klassProperty, propertyMetadata);
    }

    public static initProperties(type: Function) {

        let objectProperties = this.objectProperties.get(type);

        if (typeof objectProperties === 'undefined') {
            objectProperties = new Map();
            this.objectProperties.set(type, objectProperties);
        }

        let klassProperties = this.klassProperties.get(type);

        if (typeof klassProperties === 'undefined') {
            klassProperties = new Map();
            this.klassProperties.set(type, klassProperties);
        }

    }
}