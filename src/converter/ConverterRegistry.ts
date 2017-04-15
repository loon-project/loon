import {IConverter} from "./interface/IConverter";

export class ConverterRegistry {

    private static _converters: Map<Function, IConverter> = new Map();

    public static registerConverter(type: Function, converter: IConverter) {
        this._converters.set(type, converter);
    }
}