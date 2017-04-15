
export interface IConverter {

    serialize?(data: any, jsonType: Function): any;

    deserialize?(data: any): any;

}