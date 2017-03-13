import {HandlerMetadata} from "./HandlerMetadata";

export class FilterMetadata {

    private _handler: HandlerMetadata;

    private _type: Function;

    get handler(): HandlerMetadata {
        return this._handler;
    }

    get type(): Function {
        return this._type;
    }

    set handler(value: HandlerMetadata) {
        this._handler = value;
    }

    constructor(type: Function, handler?: HandlerMetadata) {

        this._type = type;

        if (handler) {
            this._handler = handler;
        }
    }
}