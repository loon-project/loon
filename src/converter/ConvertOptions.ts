import {ConvertTemplate} from "./ConvertTemplate";

export interface ConvertOptions {

    returnType?: Function;

    template?: ConvertTemplate;

    silent?: boolean;

    validate?: boolean;
}