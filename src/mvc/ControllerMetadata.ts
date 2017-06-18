import {HandlerMetadata} from "./HandlerMetadata";
import {ControllerFilterMetadata} from "./ControllerFilterMetadata";

export class ControllerMetadata {

    private _type: Function;

    private _baseUrl: string|RegExp;

    private _isRest: boolean;

    private _handlers: Map<string, HandlerMetadata>;

    private _beforeFilters: ControllerFilterMetadata[];

    private _afterFilters: ControllerFilterMetadata[];

    get type(): Function {
        return this._type;
    }

    get baseUrl(): string|RegExp {
        return this._baseUrl;
    }

    set baseUrl(value: string|RegExp) {
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

    get beforeFilters(): ControllerFilterMetadata[] {
        return this._beforeFilters;
    }

    get afterFilters(): ControllerFilterMetadata[] {
        return this._afterFilters;
    }

    constructor(type: Function, baseUrl?: string, isRest?: boolean) {

        this._type = type;

        if (typeof baseUrl !== 'undefined') {
            this._baseUrl = baseUrl;
        }

        if (typeof isRest !== 'undefined') {
            this._isRest = isRest;
        }

        this._handlers = new Map();

        this._beforeFilters = [];
        this._afterFilters = [];
    }

}