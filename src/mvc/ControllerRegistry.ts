import {ControllerMetadata} from "./ControllerMetadata";
import * as Express from 'express';
import {HandlerMetadata} from "./HandlerMetadata";
import {HandlerParamMetadata} from "./HandlerParamMetadata";
import {ParamType} from "./enum/ParamType";

export class ControllerRegistry {

    private static _controllers: Map<Function, ControllerMetadata> = new Map();

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

    public static controllers = ControllerRegistry._controllers;

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
     *      all the supported http methods (TODO: support all the express methods)
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

        const handlerParams = params.map((paramType, index) => new HandlerParamMetadata(type, actionName, index));
        const handlerParamsMap = new Map<number, HandlerParamMetadata>();

        handlerParams.forEach((param, index) => {
            handlerParamsMap.set(index, param);
        });

        const handlerMetadata = new HandlerMetadata(type, actionName, handlerParamsMap);
        handlerMetadata.path = path;
        handlerMetadata.httpMethod = httpMethod;

        controllerMetadata.handlers.set(actionName, handlerMetadata);
    }

    public static registerParam(type: Function, paramType: ParamType, methodName: string, index: number, expression: string) {

        let controllerMetadata = this._controllers.get(type);

        if (typeof controllerMetadata === 'undefined') {
            controllerMetadata = new ControllerMetadata(type);
            this._controllers.set(type, controllerMetadata);
        }

        let handlerMetadata = controllerMetadata.handlers.get(methodName);

        if (typeof handlerMetadata === 'undefined') {
            handlerMetadata = new HandlerMetadata(type, methodName);
            controllerMetadata.handlers.set(methodName, handlerMetadata);
        }

        const handlerParamsMap = new Map<number, HandlerParamMetadata>();
        // TODO: add isRequired feature later on
        const isRequired = false;
        const handlerParam = new HandlerParamMetadata(type, methodName, index, isRequired, paramType, expression);
        handlerParamsMap.set(index, handlerParam);

        handlerMetadata.params = handlerParamsMap;
    }


    public static registerBeforeAndAfterAction() {
    }
}
