import {HandlerMetadata} from "./HandlerMetadata";
import {ControllerFilterMetadata} from "./ControllerFilterMetadata";

export class ControllerMetadata {

    private _type: Function;

    private _baseUrl: string;

    private _handlers: Map<string, HandlerMetadata>;

    private _beforeFilters: ControllerFilterMetadata[];

    private _afterFilters: ControllerFilterMetadata[];

    get type(): Function {
        return this._type;
    }

    get baseUrl(): string {
        return this._baseUrl;
    }

    set baseUrl(value: string) {
        this._baseUrl = value;
    }

    get handlers(): Map<string, HandlerMetadata> {
        return this._handlers;
    }

    get beforeFilters(): ControllerFilterMetadata[] {
        return this._beforeFilters;
    }

    get afterFilters(): ControllerFilterMetadata[] {
        return this._afterFilters;
    }

    constructor(type: Function, baseUrl?: string) {

        this._type = type;

        if (typeof baseUrl !== 'undefined') {
            this._baseUrl = baseUrl;
        }

        this._handlers = new Map();

        this._beforeFilters = [];
        this._afterFilters = [];
    }

}