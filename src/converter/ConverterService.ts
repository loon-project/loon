import {Service} from "../mvc/decorator/Service";
import {PropertyRegistry} from "./PropertyRegistry";
import {PropertyMetadata} from "./PropertyMetadata";
import {Klass} from "../core/Klass";

/**
 * ConverterService used to convert class to object and vice-versa.
 */
@Service()
export class ConverterService {

    // used to convert class to plain js object
    public serialize(data: any, returnType: Function, baseType?: Function) {

        switch (returnType.name) {

            case "String":
                return "" + data;

            case "Number":
                return +data;

            case "Boolean":
                if (data === 'true') return true;
                if (data === 'false') return false;

                return !!data;

            case "Date":
                return new Date(data);

            case "Array":
                return data.map(item => this.serialize(item, <Function> baseType));

            default:
                const type = data.constructor;

                if (type.name === 'Map') {
                    const result = {};

                    data.forEach((value, key) => {
                        result[key] = this.serialize(value, <Function> baseType);
                    });

                    return result;
                }

                const properties = PropertyRegistry.properties.get(type);

                if (typeof properties !== 'undefined') {

                    const result = {};

                    properties.forEach((metadata: PropertyMetadata) => {

                        let value = data[metadata.klassProperty];

                        if (metadata.converter && metadata.converter.serialize) {
                            value = metadata.converter.serialize(data, metadata.klassProperty, metadata.objectProperty);
                        }

                        result[metadata.objectProperty] = value;
                    });

                    return result;
                }

                return data;
        }


    }

    // used to convert plain js object to class
    public deserialize(data: any, returnType: Function, baseType?: Function) {

        const type = data.constructor;

        switch (returnType.name) {
            case 'String':
                return "" + data;

            case 'Number':
                return +data;

            case 'Boolean':
                if (data === 'true') return true;
                if (data === 'false') return false;

                return !!data;

            case 'Date':
                return new Date(data);

            case 'Array':
                return data.map(item => this.deserialize(item, <Function> baseType));

            default:

                if (type.name === 'Map') {
                    const result = {};

                    data.forEach((value, key) => {
                        result[key] = this.deserialize(value, <Function> baseType);
                    });

                    return result;
                }

                const properties = PropertyRegistry.properties.get(type);

                if (typeof properties !== 'undefined') {
                    const klass = <Klass> type;
                    const instance = new klass();

                    properties.forEach((metadata: PropertyMetadata) => {
                        let value = data[metadata.objectProperty];

                        if (metadata.converter && metadata.converter.deserialize) {
                            value = metadata.converter.deserialize(data, metadata.klassProperty, metadata.objectProperty);
                        }

                        instance[metadata.klassProperty] = value;
                    });

                    return instance;
                }

                return data;

        }
    }

}