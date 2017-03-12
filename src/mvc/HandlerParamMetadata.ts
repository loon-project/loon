import {ParamType} from "./enum/ParamType";

export class HandlerParamMetadata {

    private _type: Function;

    private _actionName: string;

    private _index: number;

    private _returnType: Function;

    private _paramType: ParamType;

    private _expression: string;

    private _defaultValue: any;

    private _required: boolean;

    get required(): boolean {
        return this._required;
    }

    get type(): Function {
        return this._type;
    }

    get paramType(): ParamType {
        return this._paramType;
    }

    get index(): number {
        return this._index;
    }

    get expression(): string {
        return this._expression;
    }

    get actionName(): string {
        return this._actionName;
    }

    constructor(type: Function,
                actionName: string,
                index: number,
                returnType: Function,
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
}