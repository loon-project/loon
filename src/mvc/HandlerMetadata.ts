
export class HandlerMetadata {

    private _type: Function;

    private _name: string;

    private _params: Function[];

    get type(): Function {
        return this._type;
    }

    get name(): string {
        return this._name;
    }

    get params(): Function[] {
        return this._params;
    }

}