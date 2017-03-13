import {MiddlewareMetadata} from "./MiddlewareMetadata";
import {DependencyRegistry} from "../di/DependencyRegistry";
import {Klass} from "../core/Klass";
import {HandlerRegistry} from "./HandlerRegistry";
import {MiddlewareOptions} from "./MiddlewareOptions";

export class MiddlewareRegistry {

    private static _middlewares: Map<Function, MiddlewareMetadata> = new Map<Function, MiddlewareMetadata>();

    public static middlewares = MiddlewareRegistry._middlewares;

    public static registerMiddleware(type: Function, options?: MiddlewareOptions) {

        DependencyRegistry.registerComponent(<Klass>type);
        const middlewareMetadata = this.getMiddleware(type);
        middlewareMetadata.init(options);

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