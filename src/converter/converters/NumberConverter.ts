import {Convert} from "../decorator/Convert";
import {IConverter} from "../interface/IConverter";

@Convert(Number)
export class NumberConverter implements IConverter {


    public serialize(data: any, jsonType: Function): any {

        if (jsonType === String) {
            return "" + data;
        }

        if (jsonType === Number) {
            return +data;
        }

        if (jsonType === Boolean) {
            return !!data;
        }

        return null;
    }

    public deserialize(data: any): number {
        return +data;
    }
}