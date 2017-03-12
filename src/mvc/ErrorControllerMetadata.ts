import {HandlerMetadata} from "./HandlerMetadata";

export class ErrorControllerMetadata {

    private _type: Function;

    private _baseUrl: string;

    private _handler: HandlerMetadata;

    get type(): Function {
        return this._type;
    }

    get baseUrl(): string {
        return this._baseUrl;
    }

    get handler(): HandlerMetadata {
        return this._handler;
    }

    set baseUrl(value: string) {
        this._baseUrl = value;
    }

    set handler(value: HandlerMetadata) {
        this._handler = value;
    }

    constructor(type: Function, baseUrl?: string, handler?: HandlerMetadata) {

        this._type = type;

        if (baseUrl) {
            this._baseUrl = baseUrl;
        }

        if (handler) {
            this._handler = handler;
        }
    }
}