import {HandlerMetadata} from "./HandlerMetadata";

export class MiddlewareMetadata {

    private _isGlobalMiddleware: boolean;

    private _handler: HandlerMetadata;

    private _type: Function;

    // TODO: add order support for middleware
    private _order: number;

    get type(): Function {
        return this._type;
    }

    get isGlobalMiddleware(): boolean {
        return this._isGlobalMiddleware;
    }

    get handler(): HandlerMetadata {
        return this._handler;
    }

    set handler(value: HandlerMetadata) {
        this._handler = value;
    }

    set isGlobalMiddleware(value: boolean) {
        this._isGlobalMiddleware = value;
    }

    constructor(type: Function, isGlobalMiddleware?: boolean, handler?: HandlerMetadata) {

        this._type = type;

        if (typeof isGlobalMiddleware !== 'undefined') {
            this._isGlobalMiddleware = isGlobalMiddleware;
        }

        if (typeof handler !== 'undefined') {
            this._handler = handler;
        }
    }
}