import {Convert} from "../decorator/Convert";
import {IConverter} from "../interface/IConverter";

@Convert(Map)
export class MapConverter implements IConverter {

    serialize(data: any, jsonType: Function): any {
        return null;
    }

    deserialize(data: any): any {
        return null;
    }
}
