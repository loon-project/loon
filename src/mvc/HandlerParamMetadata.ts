import {ParamType} from "./enum/ParamType";

export class HandlerParamMetadata {

    private _type: Function;

    private _returnType: Function;

    private _isRequired: boolean;

    private _paramType: ParamType;

    private _index: number;

    private _expression: string;

    private _actionName: string;


    get isRequired(): boolean {
        return this._isRequired;
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

    constructor(
        type: Function,
        methodName: string,
        index: number,
        isRequired?: boolean,
        paramType?: ParamType,
        expression?: string
    ) {

        this._type = type;
        this._actionName = methodName;
        this._index = index;

        if (typeof isRequired !== 'undefined') {
            this._isRequired = isRequired;
        } else {
            this._isRequired = false;
        }

        if (typeof paramType !== 'undefined') {
            this._paramType = paramType;
        }

        if (typeof expression !== 'undefined') {
            this._expression = expression;
        }

    }
}