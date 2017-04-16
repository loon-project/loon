import {IConverter} from "../interface/IConverter";
import {Convert} from "../decorator/Convert";
import {DependencyRegistry} from "../../di/DependencyRegistry";
import {ConverterService} from "../ConverterService";

@Convert(Array)
export class ArrayConverter implements IConverter {


    public serialize<T>(data: T, klassProperty: string, objectProperty?: string): any {

        let converterService = DependencyRegistry.get(ConverterService);

        if (typeof converterService === 'undefined') {
            converterService = new ConverterService();
        }

        const array = [];

        const array = data[klassProperty];





        return null;
    }

    public deserialize(data: any): any {
        return null;
    }
}