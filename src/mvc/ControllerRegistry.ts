import {ControllerMetadata} from "./ControllerMetadata";
import {HandlerMetadata} from "./HandlerMetadata";
import {HandlerParamMetadata} from "./HandlerParamMetadata";
import {ParamType} from "./enum/ParamType";
import {ConvertUtil} from "../util/ConvertUtil";
import {MiddlewareMetadata} from "./MiddlewareMetadata";
import {DependencyRegistry} from "../di/DependencyRegistry";
import {Klass} from "../core/Klass";
import {Reflection} from "../core/Reflection";

export class ControllerRegistry {

    private static _controllers: Map<Function, ControllerMetadata> = new Map();

    public static controllers = ControllerRegistry._controllers;

    private static _middlewares: Map<Function, MiddlewareMetadata> = new Map();

    public static middlewares = ControllerRegistry._middlewares;

    /**
     * TODO: for further add api group feature
     * load router into {ControllerRegistry} for later convert to {Express.Router}
     * @param path
     */
    public static loadRoutesForPath(path: string) {
    }

    public static registerRouter() {
    }

    public static getRoutes() {
    }


    /**
     * used to register a class as a Controller or RestController
     *
     * for example:
     *
     *   @RestController("/api/v1/")
     *   class ATestController {
     *   }
     *
     *   @Controller()
     *   class BTestController {
     *   }
     *
     *   type
     *      is the controller class, in this example: ATestController or BTestController
     *
     *   baseUrl
     *      is the controller base url, in this example: "/api/v1/"
     *      if don't provide baseUrl in the decorator, then it would be blank string: ""
     *
     *   isRest
     *      is the flag indicate whether is a RestController or not
     *      RestController default render the result as JSON
     *      Controller default render the data into the template
     *
     * @param type
     * @param baseUrl
     * @param isRest
     */
    public static registerController(type: Function, baseUrl: string, isRest: boolean) {

        DependencyRegistry.registerComponent(<Klass>type);

        let controllerMetadata = this._controllers.get(type);

        if (controllerMetadata) {

            controllerMetadata.baseUrl = baseUrl;
            controllerMetadata.isRest = isRest;

        } else {

            controllerMetadata = new ControllerMetadata(type, baseUrl, isRest);
            this._controllers.set(type, controllerMetadata);

        }
    }

    /**
     * used to register a controller action, an action used to handle http request
     *
     * for example
     *
     *   @RestController()
     *   class ATestController {
     *
     *      @Get("/")
     *      public indexAction(request: Express.Request) {
     *          return "Hello world";
     *      }
     *   }
     *
     *   type
     *      is the controller class, in this example: ATestController
     *
     *   httpMethod
     *      is the http request method for the action to handle, in this example: "get",
     *      all the supported http methods
     *      TODO: support all the express methods
     *      please refer to https://expressjs.com/en/4x/api.html#app.METHOD
     *
     *   path
     *      is the http request path for the action to handle, in this example: "/"
     *
     *   actionName
     *      is the action name, in this example: "indexAction"
     *
     *   params
     *      is the parameters for the action, in this example: [Function]
     *
     * @param type
     * @param httpMethod
     * @param path
     * @param actionName
     * @param params
     */
    public static registerAction(
        type: Function,
        httpMethod: string,
        path: string|RegExp,
        actionName: string,
        params: Function[]) {

        let controllerMetadata = this._controllers.get(type);

        if (typeof controllerMetadata === 'undefined') {
            controllerMetadata = new ControllerMetadata(type);
            this._controllers.set(type, controllerMetadata);
        }

        let handlerMetadata = controllerMetadata.handlers.get(actionName);

        if (typeof handlerMetadata === 'undefined') {

            const handlerParams = params.map((paramType, index) => new HandlerParamMetadata(type, actionName, index));
            const handlerParamsMap: Map<number, HandlerParamMetadata> = ConvertUtil.convertArrayToMap(handlerParams);
            handlerMetadata = new HandlerMetadata(type, actionName, handlerParamsMap);
            controllerMetadata.handlers.set(actionName, handlerMetadata);

        }

        handlerMetadata.httpMethodAndPaths.push({
            method: httpMethod,
            path
        });
    }

    /**
     * used to register a parameter, for decoration.
     * one parameter could have multiple decorator on it,
     * this method could call multiple times to decorate same parameter
     *
     * for example:
     *
     *   @RestController()
     *   class ATestController {
     *
     *       @Get("/")
     *       public indexAction(@Request() request: Request, @BodyParam('member') @Required() member: Member) {
     *       }
     *   }
     *
     *   TODO: BodyParam serialize to a Class
     *   TODO: Required make a parameter is Required
     *
     *   type
     *      is the controller class, in this example: ATestController
     *
     *   paramType
     *      is the parameter type, in this example: ParamType.Request
     *
     *   actionName
     *      is the action name, in this example: 'indexAction'
     *
     *   index
     *      is the parameter index, in this example: 0
     *
     *   expression
     *      is the decorator expression, in this example: null, in the BodyParam example, it should be 'member'
     *
     * @param type
     * @param paramType
     * @param actionName
     * @param index
     * @param expression
     */
    public static registerParam(type: Function, paramType: ParamType, actionName: string, index: number, expression: string) {

        let controllerMetadata = this._controllers.get(type);

        if (typeof controllerMetadata === 'undefined') {
            controllerMetadata = new ControllerMetadata(type);
            this._controllers.set(type, controllerMetadata);
        }

        let handlerMetadata = controllerMetadata.handlers.get(actionName);

        if (typeof handlerMetadata === 'undefined') {
            handlerMetadata = new HandlerMetadata(type, actionName);
            controllerMetadata.handlers.set(actionName, handlerMetadata);
        }

        const handlerParamsMap = new Map<number, HandlerParamMetadata>();
        // TODO: add isRequired feature later on
        const isRequired = false;
        const handlerParam = new HandlerParamMetadata(type, actionName, index, isRequired, paramType, expression);
        handlerParamsMap.set(index, handlerParam);

        handlerMetadata.params = handlerParamsMap;
    }


    /**
     * used to register a middleware, including GlobalMiddleware, GlobalErrorMiddleware, Middleware, ErrorMiddleware
     *
     *
     * @param type
     * @param isGlobal
     * @param isError
     */
    public static registerMiddleware(type: Function, isGlobal: boolean, isError: boolean) {

        DependencyRegistry.registerComponent(<Klass>type);

        const actionName = 'use';

        const middlewareMetadata = new MiddlewareMetadata(type, isGlobal, isError);
        const handlerMetadata = new HandlerMetadata(type, actionName);

        const params = Reflection.getParams(type.prototype, actionName);
        if (params) {
            const handlerParams = params.map((paramType, index) => new HandlerParamMetadata(type, actionName, index));
            const handlerParamsMap: Map<number, HandlerParamMetadata> = ConvertUtil.convertArrayToMap(handlerParams);
            handlerMetadata.params = handlerParamsMap;
        }

        middlewareMetadata.handler = handlerMetadata;

        this._middlewares.set(type, middlewareMetadata);
    }
}
