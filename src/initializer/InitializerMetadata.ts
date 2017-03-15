
export class InitializerMetadata {

    private _type: Function;

    get type() {
        return this._type;
    }

    constructor(type: Function) {
        this._type = type;
    }
}