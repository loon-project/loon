import {MiddlewareMetadata} from "./MiddlewareMetadata";
import {MiddlewareOptions} from "./MiddlewareOptions";
import * as Express from 'express';
import {IMiddleware} from "./interface/IMiddleware";
import {DependencyRegistry} from "../di/DependencyRegistry";
import {Klass} from "../core/Klass";

/**
 * MiddlewareRegistry
 *
 * Core logic for registration all the middlewares and error middlewares
 * Expose register and get method
 *
 */
export class MiddlewareRegistry {


    /**
     * private static property using `Array` store middlewares
     */
    private static _middlewares: MiddlewareMetadata[];

    /**
     * private static property using `Array` store error middlewares
     */
    private static _errorMiddlewares: MiddlewareMetadata[];


    /**
     * register a middleware
     *
     * @param type: {Function}
     * @param options: {MiddlewareOptions}
     */
    public static registerMiddleware(type: Function, options?: MiddlewareOptions) {
        const middlewareMetadata = new MiddlewareMetadata(type, options);
        this._middlewares.push(middlewareMetadata);
    }

    /**
     * register a error middleware
     *
     * @param type: {Function}
     * @param options: {MiddlewareOptions}
     */
    public static registerErrorMiddleware(type: Function, options?: MiddlewareOptions) {
        const middlewareMetadata = new MiddlewareMetadata(type, options);
        this._errorMiddlewares.push(middlewareMetadata);
    }

    /**
     * return middleware function `(req, res, next) => any` array
     *
     * @returns {Array}
     */
    public static getMiddlewares() {

        this
            .sortMiddlewares(this._middlewares)
            .map(middlewareMetadata => {

                const middlewareKlass = <Klass>middlewareMetadata.type;
                const middlewareInstance = DependencyRegistry.get(middlewareKlass);

                return (request: Express.Request, response: Express.Response, next: Express.NextFunction) =>  {

                    return middlewareInstance.use.apply(middlewareInstance, );

                };

            });


        return this.getMiddlewaresFromStore(this._middlewares);
    }

    /**
     * return error middleware function `(error, req, res, next) => any`
     *
     * @returns {Array}
     */
    public static getErrorMiddlewares() {
        return this.getMiddlewaresFromStore(this._errorMiddlewares);
    }

    private static getMiddlewaresFromStore(store: MiddlewareMetadata[]) {
        const ret = [];

        store.forEach(middlewareMetadata => {
        });

        return ret;
    }

    private static sortMiddlewares(store: MiddlewareMetadata[]) {

        return store.sort((a, b) => {

            if (typeof a.order === 'undefined' && typeof b.order === 'undefined') {
                return 0;
            }

            if (a.order && b.order) {
                return a.order - b.order;
            }

            if (typeof a.order === 'undefined') {
                return -1;
            }

            if (typeof b.order === 'undefined') {
                return 1;
            }

            return 0;
        });
    }

}