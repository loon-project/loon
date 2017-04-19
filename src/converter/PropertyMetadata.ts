import {IConverter} from "./interface/IConverter";

export class PropertyMetadata {

    private _type: Function;

    private _klassProperty: string;

    private _objectProperty: string;

    private _propertyType: Function;

    private _converter: IConverter;

    private _baseType: Function;

    private _serialize: boolean;

    private _deserialize: boolean;

    get type(): Function {
        return this._type;
    }

    get objectProperty(): string {
        return this._objectProperty;
    }

    get klassProperty(): string {
        return this._klassProperty;
    }

    get propertyType(): Function {
        return this._propertyType;
    }

    get converter(): IConverter {
        return this._converter;
    }

    set converter(value: IConverter) {
        this._converter = value;
    }

    get serialize(): boolean {
        return this._serialize;
    }

    get deserialize(): boolean {
        return this._deserialize;
    }

    get baseType(): Function {
        return this._baseType;
    }

    set baseType(value: Function) {
        this._baseType = value;
    }

    constructor(type: Function, klassProperty: string, objectProperty: string, propertyType: Function, serialize: boolean, deserialize: boolean) {
        this._type = type;
        this._objectProperty = objectProperty;
        this._klassProperty = klassProperty;
        this._propertyType = propertyType;
        this._serialize = serialize;
        this._deserialize = deserialize;
    }
}