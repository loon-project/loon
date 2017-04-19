import {IConverter} from "./interface/IConverter";

export interface PropertyOptions {

    name?: string;

    converter?: IConverter;

    baseType?: Function;

    serialize?: boolean;

    deserialize?: boolean;
}
