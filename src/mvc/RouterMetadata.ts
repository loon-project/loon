import {HandlerMetadata} from "./HandlerMetadata";

export class RouterMetadata {

    private _type: Function;

    private _baseUrl: string;

    private _isRest: boolean;

    private _handlers: Map<string, HandlerMetadata>;

    get type(): Function {
        return this._type;
    }

    get baseUrl(): string {
        return this._baseUrl;
    }

    get isRest(): boolean {
        return this._isRest;
    }

    get handlers(): Map<string, HandlerMetadata> {
        return this._handlers;
    }

    constructor(type: Function, baseUrl: string, isRest: boolean) {
        this._type = type;
        this._baseUrl = baseUrl;
        this._isRest = isRest;
    }
}