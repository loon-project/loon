import {MiddlewareLevel} from "../enum/MiddlewareLevel";
import {MiddlewareType} from "../enum/MiddlewareType";

export interface MiddlewareMetadata {

    type: Function;

    middlewareLevel: MiddlewareLevel;

    middlewareType: MiddlewareType;

}