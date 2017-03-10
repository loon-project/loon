import {ControllerMetadata} from "./ControllerMetadata";
import {HandlerMetadata} from "./HandlerMetadata";
import {HandlerParamMetadata} from "./HandlerParamMetadata";
import {ParamType} from "./enum/ParamType";
import {ConvertUtil} from "../util/ConvertUtil";
import {MiddlewareMetadata} from "./MiddlewareMetadata";
import {DependencyRegistry} from "../di/DependencyRegistry";
import {Klass} from "../core/Klass";
import {Reflection} from "../core/Reflection";
import {MiddlewareType} from "./enum/MiddlewareType";
import {MiddlewareLevel} from "./enum/MiddlewareLevel";
import {ArgumentError} from "../core/error/ArgumentError";
import {MiddlewareStore} from "./MiddlewareStore";
import {ControllerTransformer} from "./ControllerTransformer";

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

    public static getRoutes(type?: Function) {

        const result = new Map();

        if (type) {

            const controllerMetadata = ControllerRegistry._controllers.get(type);

            if (controllerMetadata) {
                const transformer = new ControllerTransformer(controllerMetadata);
                const router = transformer.transform();
                result.set(controllerMetadata.baseUrl, router);
            }

        } else {

            ControllerRegistry.controllers.forEach(controllerMetadata => {
                const transformer = new ControllerTransformer(controllerMetadata);
                const router = transformer.transform();
                result.set(controllerMetadata.baseUrl, router);
            });
        }

        return result;
    }

    public static getGlobalMiddlewares() {
    }

    public static getGlobalErrorMiddlewares() {
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

        const controllerMetadata = this.getController(type);
        controllerMetadata.baseUrl = baseUrl;
        controllerMetadata.isRest = isRest;
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
    public static registerAction(type: Function, httpMethod: string, path: string|RegExp, actionName: string) {

        const handlerMetadata = this.getAction(type, actionName);

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

        const handlerMetadata = this.getAction(type, actionName);

        const isRequired = false;
        const handlerParam = new HandlerParamMetadata(type, actionName, index, isRequired, paramType, expression);
        handlerMetadata.params.set(index, handlerParam);
    }


    /**
     * used to register a middleware, including GlobalMiddleware, GlobalErrorMiddleware, Middleware, ErrorMiddleware
     *
     * for example:
     *
     *   @GlobalMiddleware()
     *   class ATestGlobalMiddleware implements IMiddleware {
     *      public use() {
     *      }
     *   }
     *
     *   type
     *      is the middleware class, in this example: ATestGlobalMiddleware
     *
     *   isGlobal
     *      is a flag indicate a global middleware or not, in this example: true
     *
     *   isError
     *      is a flag indicate a error middleware or not, in this example: false
     *
     *   Middleware class must implements IMiddleware interface
     *
     * @param type
     * @param isGlobal
     * @param isError
     */
    public static registerMiddleware(type: Function, isGlobal: boolean) {

        DependencyRegistry.registerComponent(<Klass>type);
        const middlewareMetadata = this.getMiddleware(type);
        middlewareMetadata.isGlobalMiddleware = isGlobal;

        const handlerMetadata = this.getAction(type, 'use');
        middlewareMetadata.handler = handlerMetadata;
    }

    /**
     * used to register an action hook, including BeforeAction, AfterAction, ErrorAction
     *
     * for example:
     *
     *   @Middleware()
     *   class ATestMiddleware implements IMiddleware {
     *      ...
     *   }
     *
     *   @BeforeAction(ATestMiddleware)
     *   @RestController()
     *   class ATestController {
     *   }
     *
     *   controllerType
     *      is the controller type for the middleware, in this example: ATestController
     *
     *   type
     *      is the middleware type, in this example: ATestMiddleware
     *
     *   middlewareLevel
     *      is the level for the middleware, in this example: MiddlewareLevel.Controller
     *
     *   middlewareType
     *      is the type for the middleware, in this example: MiddlewareType.BeforeAction
     *
     *   actionName
     *      if register a controller level middleware, actionName should be the controller action name
     *      in this example: undefined
     *
     * @param controllerType
     * @param type
     * @param middlewareLevel
     * @param middlewareType
     * @param actionName
     */
    public static registerActionHook(controllerType: Function,
                                     type: Function,
                                     middlewareLevel: MiddlewareLevel,
                                     middlewareType: MiddlewareType,
                                     actionName?: string) {

        const pushMiddlewareToStore = (store: MiddlewareStore) => {

            const middlewareMetadata = this.getMiddleware(type);

            switch (middlewareType) {
                case MiddlewareType.BeforeAction:
                    store.beforeActions.push(middlewareMetadata);
                    return;
                case MiddlewareType.AfterAction:
                    store.afterActions.push(middlewareMetadata);
                    return;
                case MiddlewareType.ErrorAction:
                    store.errorActions.push(middlewareMetadata);
                    return;
                default:
                    return;
            }
        };

        if (middlewareLevel === MiddlewareLevel.Action) {

            if (typeof actionName === 'undefined') {
                throw new ArgumentError('action middleware level should pass in action name');
            }

            const handlerMetadata = this.getAction(controllerType, actionName);
            pushMiddlewareToStore(handlerMetadata);
            return;
        }

        if (middlewareLevel === MiddlewareLevel.Controller) {

            const controllerMetadata = this.getController(controllerType);
            pushMiddlewareToStore(controllerMetadata);
            return;
        }

        throw new ArgumentError('not valid arguments');
    }

    /**
     * safe get middleware
     *
     * @param type
     * @returns {MiddlewareMetadata}
     */
    private static getMiddleware(type: Function) {

        let middlewareMetadata = this._middlewares.get(type);

        if (middlewareMetadata) {
            return middlewareMetadata;
        } else {
            middlewareMetadata = new MiddlewareMetadata(type);
            this._middlewares.set(type, middlewareMetadata);
            return middlewareMetadata;
        }
    }

    /**
     * safe get controller
     *
     * @param type
     * @returns {ControllerMetadata}
     */
    private static getController(type: Function) {

        let controllerMetadata = this._controllers.get(type);

        if (controllerMetadata) {
            return controllerMetadata;
        } else {
            controllerMetadata = new ControllerMetadata(type);
            this._controllers.set(type, controllerMetadata);
            return controllerMetadata;
        }
    }

    /**
     * safe get action
     *
     * @param type
     * @param actionName
     * @returns {HandlerMetadata}
     */
    private static getAction(type: Function, actionName: string) {

        const controllerMetadata = this.getController(type);

        let handlerMetadata = controllerMetadata.handlers.get(actionName);

        if (handlerMetadata) {
            return handlerMetadata;
        } else {

            handlerMetadata = new HandlerMetadata(type, actionName);

            const params = Reflection.getParams(type.prototype, actionName);

            if (params) {
                const handlerParams = params.map((paramType, index) => new HandlerParamMetadata(type, actionName, index));
                const handlerParamsMap: Map<number, HandlerParamMetadata> = ConvertUtil.convertArrayToMap(handlerParams);
                handlerMetadata.params = handlerParamsMap;
            }

            controllerMetadata.handlers.set(actionName, handlerMetadata);

            return handlerMetadata;
        }
    }
}
