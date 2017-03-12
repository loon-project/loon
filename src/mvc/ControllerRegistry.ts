import {ControllerMetadata} from "./ControllerMetadata";
import {DependencyRegistry} from "../di/DependencyRegistry";
import {Klass} from "../core/Klass";
import {ArgumentError} from "../core/error/ArgumentError";
import {ControllerTransformer} from "./ControllerTransformer";
import {HandlerRegistry} from "./HandlerRegistry";
import {ActionHookType} from "./enum/ActionHookType";
import {MiddlewareRegistry} from "./MiddlewareRegistry";

export class ControllerRegistry {

    private static _controllers: Map<Function, ControllerMetadata> = new Map();

    public static controllers = ControllerRegistry._controllers;

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
     *   actionName
     *      is the action name, in this example: "indexAction"
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
     * @param type
     * @param actionName
     * @param httpMethod
     * @param path
     */
    public static registerAction(type: Function, actionName: string, httpMethod: string, path: string|RegExp) {

        const controllerMetadata = this.getController(type);
        const handlerMetadata = HandlerRegistry.getHandler(type, actionName);

        handlerMetadata.httpMethodAndPaths.push({
            method: httpMethod,
            path
        });

        controllerMetadata.handlers.set(actionName, handlerMetadata);
    }



    /**
     * used to register an action hook, including BeforeAction, AfterAction
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
                                     middlewareType: Function,
                                     actionHookType: ActionHookType) {

        const controllerMetadata = this.getController(controllerType);
        const middlewareMetadata = MiddlewareRegistry.getMiddleware(middlewareType);

        switch (actionHookType) {
            case ActionHookType.BeforeAction:
                controllerMetadata.beforeActions.push(middlewareMetadata);
                return;
            case ActionHookType.AfterAction:
                controllerMetadata.afterActions.push(middlewareMetadata);
                return;
            default:
                throw new ArgumentError('not valid arguments');
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
}
