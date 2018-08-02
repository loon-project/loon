import {ParamType} from "../enum/ParamType";
import {HandlerRegistry} from "../HandlerRegistry";
import {HandlerParamOptions} from "../HandlerParamOptions";
import { Klass } from "../../core";

export function PathParam(expression: string, options?: HandlerParamOptions) {
    return (target: any, actionName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Path, actionName, index, expression, options);
    };
}

export function QueryParam(expression: string, options?: HandlerParamOptions) {
    return (target: any, actionName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Query, actionName, index, expression, options);
    };
}

export function BodyParam(expression?: string, options?: HandlerParamOptions) {
    return (target: any, actionName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Body, actionName, index, expression ? expression : "", options);
    };
}

export function HeaderParam(expression: string, options?: HandlerParamOptions) {
    return (target: any, actionName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Header, actionName, index, expression, options);
    };
}

export function Req() {
    return (target: any, actionName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Request, actionName, index, "");
    };
}

export function Res() {
    return (target: any, actionName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Response, actionName, index, "");
    };
}

export function Next() {
    return (target: any, actionName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Next, actionName, index, "");
    };
}

export function Payload() {
    return (target: any, actionName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Payload, actionName, index, "");
    };
}

export function Err() {
    return (target: any, methodName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Error, methodName, index, "");
    };
}

export function Data() {
    return (target: any, methodName: string, index: number) => {
        registerHelper(target.constructor, ParamType.Data, methodName, index, "");
    };
}

function registerHelper(type: Klass,
                        paramType: ParamType,
                        actionName: string,
                        index: number,
                        expression: string,
                        options?: HandlerParamOptions) {

    HandlerRegistry.registerParam(type, actionName, index, paramType, expression, options);
}

