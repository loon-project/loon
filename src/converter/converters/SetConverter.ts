import {Convert} from "../decorator/Convert";
import {IConverter} from "../interface/IConverter";

@Convert(Set)
export class SetConverter implements IConverter {

    public serialize(data: any, jsonType: Function): any {
        return null;
    }

    public deserialize(data: any): any {
        return null;
    }
}