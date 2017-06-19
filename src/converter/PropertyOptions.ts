import {IConverter} from "./interface/IConverter";

export interface PropertyOptions {

    name?: string;

    converter?: new (...args) => IConverter;

    baseType?: Function;

    serialize?: boolean;

    deserialize?: boolean;
}
