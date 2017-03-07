import {MiddlewareOptions} from "./MiddlewareOptions";


/**
 * MiddlewareMetadata
 *
 * The metadata class for both middleware and error middleware
 * The one with order property, used to determine the global middlewares ordering
 * The one without order property, list afterwards
 *
 * For example:
 *   @Middleware({order: 1})
 *   class MiddlewareA implements IMiddleware {}
 *
 *   @Middleware({order: 2})
 *   class MiddlewareB implements IMiddleware {}
 *
 *   @Middleware()
 *   class MiddlewareC implements IMiddleware {}
 *
 * The global middleware order should be MiddlewareA, MiddlewareB, MiddlewareC
 *
 */
export class MiddlewareMetadata {

    private _order: number;

    private _type: Function;

    get order(): number {
        return this._order;
    }

    get type(): Function {
        return this._type;
    }

    constructor(type: Function, options?: MiddlewareOptions) {

        this._type = type;

        if (options) {
            if (options.order) {
                this._order = options.order;
            }
        }
    }
}