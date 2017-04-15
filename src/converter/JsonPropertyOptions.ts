import {IConverter} from "./interface/IConverter";

export interface JsonPropertyOptions {

    name?: string;

    converter?: IConverter;

    type?: Function;

}