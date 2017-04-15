import {Convert} from "../decorator/Convert";
import {IConverter} from "../interface/IConverter";

@Convert(String)
export class StringConverter implements IConverter {

    serialize(data: any, jsonType: Function): any {

        if (jsonType === Number) {
            return +data;
        }

        if (jsonType === String) {
            return "" + data;
        }

        if (jsonType === Boolean) {

            if (data === "true") return true;
            if (data === "false") return false;

            return !!data;
        }


        return data;
    }

    deserialize(data: any): string {
        return "" + data;
    }
}