import {ParamType} from "../enum/ParamType";

export interface ParamMetadata {

    type: Function;

    paramType: ParamType;

    actionName: string;

    index: number;

    expression: string;
}