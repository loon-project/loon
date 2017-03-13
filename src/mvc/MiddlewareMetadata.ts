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

        if (options && options.order) {
            this._order = options.order;
        }

        if (options && options.baseUrl) {
            this._baseUrl = options.baseUrl;
        }

        if (options && typeof options.isError !== 'undefined') {
            this._isErrorMiddleware = options.isError;
        }

        return this;
    }

}