
import {MiddlewareMetadataArgs} from "./MiddlewareMetadataArgs";
export class MiddlewareMetadata {

    public target: Function;

    public beforeAction: boolean;

    public afterAction: boolean;

    constructor(args: MiddlewareMetadataArgs) {

    }
}