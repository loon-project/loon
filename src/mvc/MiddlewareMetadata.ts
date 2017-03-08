import {HandlerMetadata} from "./HandlerMetadata";

export class MiddlewareMetadata {

    private _isGlobalMiddleware: boolean;

    private _isErrorMiddleware: boolean;

    private _handler: HandlerMetadata;

    private _type: Function;

    get type(): Function {
        return this._type;
    }

    get isGlobalMiddleware(): boolean {
        return this._isGlobalMiddleware;
    }

    get isErrorMiddleware(): boolean {
        return this._isErrorMiddleware;
    }

    get handler(): HandlerMetadata {
        return this._handler;
    }

    set handler(value: HandlerMetadata) {
        this._handler = value;
    }

    constructor(type: Function, isGlobalMiddleware: boolean, isErrorMiddleware: boolean, handler?: HandlerMetadata) {

        this._type = type;
        this._isGlobalMiddleware = isGlobalMiddleware;
        this._isErrorMiddleware = isErrorMiddleware;

        if (typeof handler !== 'undefined') {
            this._handler = handler;
        }
    }
}