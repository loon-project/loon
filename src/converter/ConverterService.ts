import {Service} from "../mvc/decorator/Service";

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

}