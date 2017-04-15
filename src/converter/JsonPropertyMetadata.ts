
export class JsonPropertyMetadata {

    private _type: Function;

    private _jsonName: string;

    private _jsonType: Function;

    private _propertyName: string;

    private _propertyType: Function;

    private _converter: Function;


    get type(): Function {
        return this._type;
    }

    get jsonName(): string {
        return this._jsonName;
    }

    get jsonType(): Function {
        return this._jsonType;
    }

    get propertyName(): string {
        return this._propertyName;
    }

    get propertyType(): Function {
        return this._propertyType;
    }

    get converter(): Function {
        return this._converter;
    }

    set converter(value: Function) {
        this._converter = value;
    }

    constructor(type: Function, jsonName: string, jsonType: Function, propertyName: string, propertyType: Function) {
        this._type = type;
        this._jsonName = jsonName;
        this._jsonType = jsonType;
        this._propertyName = propertyName;
        this._propertyType = propertyType;
    }
}