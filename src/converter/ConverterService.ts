import {Service} from "../mvc/decorator/Service";
import {PropertyRegistry} from "./PropertyRegistry";
import {PropertyMetadata} from "./PropertyMetadata";
import * as _ from "lodash";
import {TypeUtil} from "../util/TypeUtil";
import {Klass} from "../core/Klass";

/**
 * ConverterService used to convert class to object and vice-versa.
 */
@Service()
export class ConverterService {

    public convert(data: any, returnType: Function, baseType?: Function) {

        if (_.isUndefined(data) || _.isNull(data)) {
            return data;
        }

        const type = data.constructor;
        let properties;

        if (returnType === type && typeof baseType === 'undefined') {
            return data;
        }


        if (returnType === String) {
            return "" + data;
        }

        if (returnType === Number) {
            return +data;
        }

        if (returnType === Boolean) {
            if (data === 'true') return true;
            if (data === 'false') return false;

            return !!data;
        }

        if (returnType === Date) {
            return new Date(data);
        }

        if (returnType === Array && type === Array && baseType) {
            return data.map(item => this.convert(item, baseType));
        }

        if (returnType === Map && type === Map && baseType) {
            const result = new Map();

            data.forEach((value, key) => {
                result.set(key, this.convert(value, baseType));
            });

            return result;
        }

        /**
         *
         * Convert class instance to object
         * If provide a converter, and implement serialize function
         * it will use serialize function result as the property value
         *
         */
        properties = PropertyRegistry.properties.get(type);
        if (returnType === Object && !TypeUtil.isSimpleType(type) && properties) {

            const result = {};

            properties.forEach((metadata: PropertyMetadata) => {

                if (metadata.serialize === false) return;

                let value = data[metadata.klassProperty];

                value = this.convert(value, metadata.propertyType, metadata.baseType);

                if (metadata.converter && metadata.converter.serialize) {
                    value = metadata.converter.serialize(data, metadata.klassProperty, metadata.objectProperty);
                }

                result[metadata.objectProperty] = value;
            });

            return result;
        }

        /**
         *
         * Convert object to class instance
         * If provide a converter, and implement deserialize function
         * it will use deserialize function result as the property value
         *
         */
        properties = PropertyRegistry.properties.get(returnType);
        if (type === Object && !TypeUtil.isSimpleType(returnType) && properties) {

            const klass = <Klass> returnType;
            const ins = new klass();

            properties.forEach((metadata: PropertyMetadata) => {

                if (metadata.deserialize === false) return;

                let value = data[metadata.objectProperty];

                value = this.convert(value, metadata.propertyType, metadata.baseType);

                if (metadata.converter && metadata.converter.deserialize) {
                    value = metadata.converter.deserialize(data, metadata.klassProperty, metadata.objectProperty);
                }

                ins[metadata.klassProperty] = value;
            });

            return ins;
        }

        /**
         *
         * Convert a class instance to another class instance
         * based on the class property name, convert, ignore converter and serialize and deserialize options
         *
         */
        const returnProperties = PropertyRegistry.properties.get(returnType);
        properties = PropertyRegistry.properties.get(type);
        if (!TypeUtil.isSimpleType(type) && !TypeUtil.isSimpleType(returnType) && properties && returnProperties) {

            const klass = <Klass> returnType;

            const ins = new klass();

            returnProperties.forEach((metadata: PropertyMetadata) => {
                const value = this.convert(data[metadata.klassProperty], metadata.propertyType, metadata.baseType);
                ins[metadata.klassProperty] = value;
            });

            return ins;
        }

        throw new Error(`not support convert data`);
    }
}