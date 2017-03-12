import {MiddlewareMetadata} from "./MiddlewareMetadata";
import {DependencyRegistry} from "../di/DependencyRegistry";
import {Klass} from "../core/Klass";
import {HandlerRegistry} from "./HandlerRegistry";

export class MiddlewareRegistry {

    private static _middlewares: Map<Function, MiddlewareMetadata> = new Map();

    public static middlewares = MiddlewareRegistry._middlewares;

    /**
     * used to register a middleware, including GlobalMiddleware, Middleware
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

        const handlerMetadata = HandlerRegistry.getHandler(type, 'use');
        middlewareMetadata.handler = handlerMetadata;
    }

    /**
     * safe get middleware
     *
     * @param type
     * @returns {MiddlewareMetadata}
     */
    public static getMiddleware(type: Function) {

        let middlewareMetadata = this._middlewares.get(type);

        if (middlewareMetadata) {
            return middlewareMetadata;
        } else {
            middlewareMetadata = new MiddlewareMetadata(type);
            this._middlewares.set(type, middlewareMetadata);
            return middlewareMetadata;
        }
    }
}