import {Service} from "../mvc/decorator/Service";

@Service()
export class ConverterService {

    // used to convert class to plain js object
    public serialize(data: any) {

    }

    // used to convert plain js object to class
    public deserialize(data: any, klass: Function) {
    }

}