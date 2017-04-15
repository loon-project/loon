import {Convert} from "../decorator/Convert";
import {IConverter} from "../interface/IConverter";
import * as _ from 'lodash';

@Convert(Date)
export class DateConverter implements IConverter {

    public serialize(date: Date): any {
        return date.toISOString();
    }

    public deserialize(data: any): Date {

        if (_.isNumber(data)) {
            return new Date(data);
        }

        if (_.isString(data)) {
            return new Date(data);
        }

        throw new Error(`can not convert ${data} to Date`);
    }
}
