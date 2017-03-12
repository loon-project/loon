import {HandlerMetadata} from "./HandlerMetadata";
import {Reflection} from "../core/Reflection";
import {HandlerParamMetadata} from "./HandlerParamMetadata";
import {ConvertUtil} from "../util/ConvertUtil";
import {ParamType} from "./enum/ParamType";

/**
 * HandlerRegistry
 *
 * Every actions inside Middleware, Controller, or ErrorHandler
 * for handling http request, considered as a handler
 *
 * This class is the center logic to register a handler, and retrieve a handler/handlers
 * for Middleware, Controller, ErrorHandler
 *
 */
export class HandlerRegistry {

    private static _handlers: Map<Function, Map<string, HandlerMetadata>> = new Map();

    public static handlers = HandlerRegistry._handlers;

    /**
     *
     * This function used to register a parameter for a handler
     *
     * for example:
     *
     *     @RestController()
     *     class UserController {
     *
     *         @Get("/")
     *         public indexAction(@BodyParam("user") user: User) {
     *         }
     *     }
     *
     *    type
     *      is the controller class, in this example: ATestController
     *
     *    actionName
     *      is the action name, in this example: 'indexAction'
     *
     *    index
     *      is the parameter index, in this example: 0
     *
     *    returnType
     *      is the parameter value type, in this example: User
     *
     *    paramType
     *      is the parameter type, in this example: ParamType.BodyParam
     *
     *    expression
     *      is the decorator expression, in this example: null, in the BodyParam example, it should be 'member'
     *
     *    options
     *      is the parameter options, TODO: PARAMETER_OPTIONS
     *
     * @param type
     * @param actionName
     * @param index
     * @param returnType
     * @param paramType
     * @param expression
     * @param options
     */
    public static registerParam(type: Function,
                                actionName: string,
                                index: number,
                                paramType: ParamType,
                                expression: string) {

        const handlerMetadata = this.getHandler(type, actionName);

        const params = Reflection.getParams(type.prototype, actionName);
        const returnType = params[index];

        const handlerParam = new HandlerParamMetadata(type, actionName, index, returnType, paramType, expression);

        handlerMetadata.params.set(index, handlerParam);
    }

    /**
     * safe get HandlerMetadata
     *
     * @param type
     * @param actionName
     * @returns {HandlerMetadata}
     */
    public static getHandler(type: Function, actionName: string) {

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
                const handlerParamsMap: Map<number, HandlerParamMetadata> = ConvertUtil.convertArrayToMap(handlerParams);
                handlerMetadata.params = handlerParamsMap;
            }

            handlerStore.set(actionName, handlerMetadata);
        }

        return handlerMetadata;
    }
}