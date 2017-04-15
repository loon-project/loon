import {IConverter} from "../interface/IConverter";
import {Convert} from "../decorator/Convert";

@Convert(Symbol)
export class SymbolConverter implements IConverter {

}