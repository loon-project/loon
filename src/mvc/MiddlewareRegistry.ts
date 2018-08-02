import {MiddlewareMetadata} from "./MiddlewareMetadata";
import {DependencyRegistry} from "../di/DependencyRegistry";
import {Klass} from "../core/Klass";
import {HandlerRegistry} from "./HandlerRegistry";
import {MiddlewareOptions} from "./MiddlewareOptions";

export class MiddlewareRegistry {

    private static _middlewares: Map<Klass, MiddlewareMetadata> = new Map();

    public static middlewares = MiddlewareRegistry._middlewares;

    public static registerMiddleware(type: Klass, isErrorMiddleware: boolean, options?: MiddlewareOptions) {
        DependencyRegistry.registerComponent(<Klass>type);
        const middlewareMetadata = this.getMiddleware(type);
        middlewareMetadata.init(options);
        middlewareMetadata.isErrorMiddleware = isErrorMiddleware;

        const handlerMetadata = HandlerRegistry.getHandler(type, 'use');
        middlewareMetadata.handler = handlerMetadata;
    }

    public static unregisterAll() {
        MiddlewareRegistry.middlewares.forEach((_, type: Klass) => {
            DependencyRegistry.unregisterComponent(type)
            MiddlewareRegistry.middlewares.delete(type)
        })
    }

    public static unregister(type: Klass) {
        DependencyRegistry.unregisterComponent(type as Klass)
        MiddlewareRegistry.middlewares.delete(type)
    }

    public static getMiddlewares(options: {isErrorMiddleware: boolean}) {
        const middlewares: MiddlewareMetadata[] = [];

        this._middlewares.forEach(middlewareMetadata => {
            if (middlewareMetadata.isErrorMiddleware === options.isErrorMiddleware) {
                middlewares.push(middlewareMetadata);
            }
        });

        return this.sortMiddlewares(middlewares);

    }

    private static sortMiddlewares(middlewares: MiddlewareMetadata[]) {
        return middlewares.sort((m1, m2) => m1.order - m2.order);
    }

    /**
     * safe get middleware
     *
     * @param type
     * @returns {MiddlewareMetadata}
     */
    public static getMiddleware(type: Klass) {

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