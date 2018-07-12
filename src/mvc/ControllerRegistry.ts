import {ControllerMetadata} from "./ControllerMetadata";
import {DependencyRegistry} from "../di/DependencyRegistry";
import {Klass} from "../core/Klass";
import {HandlerRegistry} from "./HandlerRegistry";
import {BeforeAfterFilterType} from "./enum/BeforeAfterFilterType";
import {FilterOptions} from "./FilterOptions";
import {FilterRegistry} from "./FilterRegistry";
import {ControllerFilterMetadata} from "./ControllerFilterMetadata";

export class ControllerRegistry {

    private static _controllers: Map<Function, ControllerMetadata> = new Map();

    public static controllers = ControllerRegistry._controllers;

    public static unregisterAll() {
        ControllerRegistry.controllers.forEach((_, klass) => {
            ControllerRegistry.unregister(klass as Klass)
        })
    }

    public static unregister(klass: Klass) {
        DependencyRegistry.unregisterComponent(klass)
        ControllerRegistry.controllers.delete(klass)
    }


    /**
     * used to register a class as a Controller
     *
     * for example:
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
     * @param type
     * @param baseUrl
     */
    public static registerController(type: Function, baseUrl: string) {

        DependencyRegistry.registerComponent(<Klass>type);

        const controllerMetadata = this.getController(type);
        controllerMetadata.baseUrl = baseUrl;
    }


    /**
     * used to register a controller action, an action used to handle http request
     *
     * for example
     *
     *   @Controller()
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
    public static registerAction(type: Function, actionName: string, httpMethod: string, path: string) {

        const controllerMetadata = this.getController(type);
        const handlerMetadata = HandlerRegistry.getHandler(type, actionName);

        handlerMetadata.httpMethodAndPaths.push({
            method: httpMethod,
            path
        });

        controllerMetadata.handlers.set(actionName, handlerMetadata);
    }


    public static registerFilter(controllerType: Function,
                                 filterType: Function,
                                 beforeOrAfterFilter: BeforeAfterFilterType,
                                 options?: FilterOptions) {

        const controllerMetadata = this.getController(controllerType);
        const filterMetadata = FilterRegistry.getFilter(filterType);
        const controllerFilterMetadata = new ControllerFilterMetadata(filterMetadata, options);

        switch (beforeOrAfterFilter) {
            case BeforeAfterFilterType.BeforeFilter:
                controllerMetadata.beforeFilters.push(controllerFilterMetadata);
                return;
            case BeforeAfterFilterType.AfterFilter:
                controllerMetadata.afterFilters.push(controllerFilterMetadata);
                return;
            default:
                throw new Error("not valid arguments");
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

        if (typeof controllerMetadata === 'undefined') {
            controllerMetadata = new ControllerMetadata(type);
            this._controllers.set(type, controllerMetadata);
        }

        return controllerMetadata;
    }
}
