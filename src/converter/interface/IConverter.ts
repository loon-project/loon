
export interface IConverter {

    serialize?(data: any, klassProperty: string, objectProperty: string): any;

    deserialize?(data: any, klassProperty: string, objectProperty: string): any;

}