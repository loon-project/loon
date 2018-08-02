import {ParamType} from "./enum/ParamType";
import {HandlerParamOptions} from "./HandlerParamOptions";
import { Klass } from "../core";

export class HandlerParamMetadata {

    private _type: Klass;

    private _actionName: string;

    private _index: number;

    private _returnType: Klass;

    private _paramType: ParamType;

    private _expression: string;

    private _defaultValue: any;

    private _required: boolean;

    get required() {
        return this._required;
    }

    get type() {
        return this._type;
    }

    get paramType() {
        return this._paramType;
    }

    get index() {
        return this._index;
    }

    get expression() {
        return this._expression;
    }

    get actionName() {
        return this._actionName;
    }

    get returnType() {
        return this._returnType;
    }

    constructor(type: Klass,
                actionName: string,
                index: number,
                returnType: Klass,
                paramType?: ParamType,
                expression?: string) {

        this._type = type;
        this._actionName = actionName;
        this._returnType = returnType;
        this._index = index;

        if (typeof paramType !== 'undefined') {
            this._paramType = paramType;
        }

        if (typeof expression !== 'undefined') {
            this._expression = expression;
        }
    }

    public setOptions(options?: HandlerParamOptions) {

        if (options && typeof options.required !== 'undefined') {
            this._required = options.required;
        } else {
            this._required = false;
        }

        if (options && typeof options.defaultValue !== 'undefined') {
            this._defaultValue = options.defaultValue;
        }

    }
}