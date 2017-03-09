import {HandlerParamMetadata} from "./HandlerParamMetadata";
import {HTTPMethodAndPath} from "./HTTPMethodAndPath";
import {MiddlewareMetadata} from "./metadata/MiddlewareMetadata";
import {MiddlewareStore} from "./MiddlewareStore";

export class HandlerMetadata extends MiddlewareStore {

    private _type: Function;

    private _actionName: string;

    private _params: Map<number, HandlerParamMetadata>;

    private _httpMethodAndPaths: HTTPMethodAndPath[];

    private _isErrorHandler: boolean;

    get params(): Map<number, HandlerParamMetadata> {
        return this._params;
    }

    get isErrorHandler(): boolean {
        return this._isErrorHandler;
    }

    get type(): Function {
        return this._type;
    }

    get actionName(): string {
        return this._actionName;
    }

    get httpMethodAndPaths(): HTTPMethodAndPath[] {
        return this._httpMethodAndPaths;
    }

    set params(value: Map<number, HandlerParamMetadata>) {
        this._params = value;
    }

    set isErrorHandler(value: boolean) {
        this._isErrorHandler = value;
    }

    constructor(type: Function, actionName: string, params?: Map<number, HandlerParamMetadata>, isErrorHandler?: boolean) {

        super();

        this._type = type;
        this._actionName = actionName;

        if (typeof params !== 'undefined') {
            this._params = params;
        } else {
            this._params = new Map();
        }

        if (typeof isErrorHandler !== 'undefined') {
            this._isErrorHandler = isErrorHandler;
        } else {
            this._isErrorHandler = false;
        }

        this._httpMethodAndPaths = [];
    }
}