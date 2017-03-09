import {HandlerMetadata} from "./HandlerMetadata";
import {MiddlewareStore} from "./MiddlewareStore";

export class ControllerMetadata extends MiddlewareStore {

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

    set baseUrl(value: string) {
        this._baseUrl = value;
    }

    get isRest(): boolean {
        return this._isRest;
    }

    set isRest(value: boolean) {
        this._isRest = value;
    }

    get handlers(): Map<string, HandlerMetadata> {
        return this._handlers;
    }

    constructor(type: Function, baseUrl?: string, isRest?: boolean) {

        super();

        this._type = type;

        if (typeof baseUrl !== 'undefined') {
            this._baseUrl = baseUrl;
        }

        if (typeof isRest !== 'undefined') {
            this._isRest = isRest;
        }

        this._handlers = new Map();
    }

}