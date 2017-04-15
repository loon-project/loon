import {IConverter} from "../interface/IConverter";
import {ConverterRegistry} from "../ConverterRegistry";

/**
 *
 * Convert decorator is used internally
 *
 * Specify class property type as the source of truth
 * The converter handle different kinds of json type cases
 *
 */
export function Convert(type: Function) {

    return (converter: IConverter) => {
        ConverterRegistry.registerConverter(type, converter);
    };

}