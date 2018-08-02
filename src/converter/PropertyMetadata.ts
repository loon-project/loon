import { IConverter } from "./interface/IConverter";
import { Klass } from "../core";

export class PropertyMetadata {

    private _type: Klass;

    private _klassProperty: string;

    private _objectProperty: string;

    private _propertyType: Klass;

    private _converter: IConverter;

    private _baseType: Klass;

    private _serialize: boolean;

    private _deserialize: boolean;

    get type() {
        return this._type;
    }

    get objectProperty() {
        return this._objectProperty;
    }

    get klassProperty() {
        return this._klassProperty;
    }

    get propertyType() {
        return this._propertyType;
    }

    get converter() {
        return this._converter;
    }

    set converter(value: IConverter) {
        this._converter = value;
    }

    get serialize() {
        return this._serialize;
    }

    get deserialize() {
        return this._deserialize;
    }

    get baseType() {
        return this._baseType;
    }

    set baseType(value: Klass) {
        this._baseType = value;
    }

    constructor(type: Klass, klassProperty: string, objectProperty: string, propertyType: Klass, serialize: boolean, deserialize: boolean) {
        this._type = type;
        this._objectProperty = objectProperty;
        this._klassProperty = klassProperty;
        this._propertyType = propertyType;
        this._serialize = serialize;
        this._deserialize = deserialize;
    }
}