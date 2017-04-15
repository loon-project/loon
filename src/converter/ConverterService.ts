import {Service} from "../mvc/decorator/Service";
import * as _ from 'lodash';

@Service()
export class ConverterService {

    private cachedKlassToJsonTemplates: Map<Function, any> = new Map();

    private cachedJsonToKlassTemplates: Map<Function, any> = new Map();

    // used to convert class to plain js object
    public serialize(data: any) {
    }

    // used to convert plain js object to class
    public deserialize(data: any, klass: Function) {
    }

    private dateSerialize(date: Date, type: Function) {

        if (type === String) {
            return date.toISOString();
        }

        if (type === Number) {
            return date.getTime();
        }

        throw new Error(`can not convert Date to ${type}`);
    }
}