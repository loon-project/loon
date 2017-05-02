import "../TestHelper";
import {ErrorMiddleware, Middleware} from "../../src/mvc/decorator/Middleware";
import {IMiddleware} from "../../src/mvc/interface/IMiddleware";
import {MiddlewareRegistry} from "../../src/mvc/MiddlewareRegistry";
import {expect} from 'chai';
import {MiddlewareMetadata} from "../../src/mvc/MiddlewareMetadata";

describe("MiddlewareRegistry", () => {

    @Middleware()
    class ATestMiddlewareRegistryMiddlewareClass implements IMiddleware {

        public use() {
        }
    }

    @ErrorMiddleware()
    class ATestMiddlewareRegistryErrorMiddlewareClass implements IMiddleware {

        public use() {
        }
    }

    @Middleware({order: 19})
    class ATestMiddlewareRegistryMiddlewareWithOrderClass1 implements IMiddleware {

        public use() {
        }
    }

    @Middleware({order: 2})
    class ATestMiddlewareRegistryMiddlewareWithOrderClass2 implements IMiddleware {

        public use() {
        }
    }

    @ErrorMiddleware({order: 19})
    class ATestMiddlewareRegistryErrorMiddlewareWithOrderClass1 implements IMiddleware {

        public use() {
        }
    }

    @ErrorMiddleware({order: 2})
    class ATestMiddlewareRegistryErrorMiddlewareWithOrderClass2 implements IMiddleware {

        public use() {
        }
    }

    @Middleware({baseUrl: "/test"})
    class ATestMiddlewareRegistryMiddlewareWithBaseUrlClass implements IMiddleware {

        public use() {
        }
    }

    @ErrorMiddleware({baseUrl: "/test"})
    class ATestMiddlewareRegistryErrorMiddlewareWithBaseUrlClass implements IMiddleware {

        public use() {
        }
    }

    it('should successfully register a Middleware', () => {
        const middlewareMetadata: any = MiddlewareRegistry.middlewares.get(ATestMiddlewareRegistryMiddlewareClass);

        expectMiddleware(middlewareMetadata, {
            type: ATestMiddlewareRegistryMiddlewareClass,
            isErrorMiddleware: false
        });
    });

    it('should successfully register a ErrorMiddleware', () => {
        const middlewareMetadata: any = MiddlewareRegistry.middlewares.get(ATestMiddlewareRegistryErrorMiddlewareClass);

        expectMiddleware(middlewareMetadata, {
            type: ATestMiddlewareRegistryErrorMiddlewareClass,
            isErrorMiddleware: true
        });
    });

    it('should successfully register a Middleware with order', () => {
        const middlewares = MiddlewareRegistry.getMiddlewares({isErrorMiddleware: false});

        const firstMiddleware = middlewares[0];

        expectMiddleware(firstMiddleware, {
            type: ATestMiddlewareRegistryMiddlewareWithOrderClass2,
            isErrorMiddleware: false,
            order: 2
        });

        const secondMiddleware = middlewares[1];

        expectMiddleware(secondMiddleware, {
            type: ATestMiddlewareRegistryMiddlewareWithOrderClass1,
            isErrorMiddleware: false,
            order: 19
        });
    });

    it('should successfully register a ErrorMiddleware with order', () => {
        const middlewares = MiddlewareRegistry.getMiddlewares({isErrorMiddleware: true});

        const firstMiddleware = middlewares[0];

        expectMiddleware(firstMiddleware, {
            type: ATestMiddlewareRegistryErrorMiddlewareWithOrderClass2,
            isErrorMiddleware: true,
            order: 2
        });

        const secondMiddleware = middlewares[1];

        expectMiddleware(secondMiddleware, {
            type: ATestMiddlewareRegistryErrorMiddlewareWithOrderClass1,
            isErrorMiddleware: true,
            order: 19
        });

    });

    it('should successfully register a middleware with base url', () => {
        const middleware: any = MiddlewareRegistry.middlewares.get(ATestMiddlewareRegistryMiddlewareWithBaseUrlClass);

        expectMiddleware(middleware, {
            type: ATestMiddlewareRegistryMiddlewareWithBaseUrlClass,
            isErrorMiddleware: false,
            baseUrl: "/test"
        });
    });

    it('should successfully register a error middleware with base url', () => {
        const middleware: any = MiddlewareRegistry.middlewares.get(ATestMiddlewareRegistryErrorMiddlewareWithBaseUrlClass);

        expectMiddleware(middleware, {
            type: ATestMiddlewareRegistryErrorMiddlewareWithBaseUrlClass,
            isErrorMiddleware: true,
            baseUrl: "/test"
        });
    });

    function expectMiddleware(metadata: MiddlewareMetadata, result: any) {

        expect(metadata.type).to.be.equal(result.type);
        expect(metadata.handler).to.not.be.undefined;
        expect(metadata.isErrorMiddleware).to.be.equal(result.isErrorMiddleware);

        if (result.baseUrl) {
            expect(metadata.baseUrl).to.be.equal(result.baseUrl);
        }

        if (result.order) {
            expect(metadata.order).to.be.equal(result.order);
        }
    }
});