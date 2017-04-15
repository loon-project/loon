import {IConverter} from "../interface/IConverter";
import {Convert} from "../decorator/Convert";

@Convert(Array)
export class ArrayConverter implements IConverter {

}