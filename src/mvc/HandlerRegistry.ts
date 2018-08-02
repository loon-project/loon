import { HandlerMetadata } from "./HandlerMetadata";
import { Reflection } from "../core/Reflection";
import { HandlerParamMetadata } from "./HandlerParamMetadata";
import { convertArrayToMap } from '../util';
import { ParamType } from "./enum/ParamType";
import { HandlerParamOptions } from "./HandlerParamOptions";
import { Klass } from "../core";

export class HandlerRegistry {

    private static _handlers: Map<Klass, Map<string, HandlerMetadata>> = new Map();

    public static handlers = HandlerRegistry._handlers;

    public static registerParam(type: Klass,
                                actionName: string,
                                index: number,
                                paramType: ParamType,
                                expression: string,
                                options?: HandlerParamOptions) {

        const handlerMetadata = this.getHandler(type, actionName);

        const params = Reflection.getParams(type.prototype, actionName);
        const returnType = params[index];

        const handlerParam = new HandlerParamMetadata(type, actionName, index, returnType, paramType, expression);

        handlerParam.setOptions(options);

        handlerMetadata.params.set(index, handlerParam);
    }

    /**
     * safe get HandlerMetadata
     *
     * @param type
     * @param actionName
     * @returns {HandlerMetadata}
     */
    public static getHandler(type: Klass, actionName: string) {

        let handlerStore = this._handlers.get(type);

        if (typeof handlerStore === 'undefined') {
            handlerStore = new Map();
            this._handlers.set(type, handlerStore);
        }

        let handlerMetadata = handlerStore.get(actionName);

        if (typeof handlerMetadata === 'undefined') {
            handlerMetadata = new HandlerMetadata(type, actionName);

            const params = Reflection.getParams(type.prototype, actionName);

            if (params) {
                const handlerParams = params.map((returnType, index) => new HandlerParamMetadata(type, actionName, index, returnType));
                const handlerParamsMap: Map<number, HandlerParamMetadata> = convertArrayToMap(handlerParams);
                handlerMetadata.params = handlerParamsMap;
            }

            handlerStore.set(actionName, handlerMetadata);
        }

        return handlerMetadata;
    }
}