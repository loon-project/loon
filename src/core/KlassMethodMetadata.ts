import {KlassMethodParamMetadata} from "./KlassMethodParamMetadata";

export class KlassMethodMetadata {

    private _type: Function;

    private _methodName: string;

    private _params: Map<number, KlassMethodParamMetadata>;

}