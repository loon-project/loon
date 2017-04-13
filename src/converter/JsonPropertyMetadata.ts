
export class JsonPropertyMetadata {

    private _type: Function;

    private _name: string;

    private _returnType: Function;

    private _converter: Function;


    constructor(type: Function, name: string, returnType: Function, converter?: Function) {
        this._type = type;
        this._name = name;
        this._returnType = returnType;

        if (typeof converter !== 'undefined') {
            this._converter = converter;
        }
    }
}