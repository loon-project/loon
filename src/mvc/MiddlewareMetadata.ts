import {HandlerMetadata} from "./HandlerMetadata";
import {MiddlewareOptions} from "./MiddlewareOptions";

export class MiddlewareMetadata {

    private _handler: HandlerMetadata;

    private _type: Function;

    private _order: number;

    private _baseUrl: string;

    private _isErrorMiddleware: boolean;

    get type(): Function {
        return this._type;
    }

    get order(): number {
        return this._order;
    }

    get baseUrl(): string {
        return this._baseUrl;
    }

    get isErrorMiddleware(): boolean {
        return this._isErrorMiddleware;
    }

    set isErrorMiddleware(value: boolean) {
        this._isErrorMiddleware = value;
    }

    get handler(): HandlerMetadata {
        return this._handler;
    }

    set handler(handler: HandlerMetadata) {

        if (this._isErrorMiddleware) {
            handler.isErrorHandler = true;
        }

        this._handler = handler;
    }


    constructor(type: Function, options?: MiddlewareOptions) {

        this._type = type;

        this.init(options);
    }

    public init(options?: MiddlewareOptions) {

        this._order = Number.MAX_SAFE_INTEGER;
        this._baseUrl = "/";
        this._isErrorMiddleware = false;

        if (options && typeof options.order !== 'undefined') {
            this._order = options.order;
        }

        if (options && typeof options.baseUrl !== 'undefined') {
            this._baseUrl = options.baseUrl;
        }

        return this;
    }
}