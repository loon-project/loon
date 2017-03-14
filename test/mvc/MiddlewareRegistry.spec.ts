import "../TestHelper";
import {Middleware, ErrorMiddleware} from "../../src/mvc/decorator/Middleware";
import {IMiddleware} from "../../src/mvc/interface/IMiddleware";
import {MiddlewareRegistry} from "../../src/mvc/MiddlewareRegistry";
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

        middlewareMetadata.should.not.be.undefined;
        middlewareMetadata.type.should.be.equal(ATestMiddlewareRegistryMiddlewareClass);
        middlewareMetadata.isErrorMiddleware.should.be.false;
        middlewareMetadata.handler.should.not.be.undefined;
        middlewareMetadata.handler.isErrorHandler.should.be.false;
    });

    it('should successfully register a ErrorMiddleware', () => {
        const middlewareMetadata: any = MiddlewareRegistry.middlewares.get(ATestMiddlewareRegistryErrorMiddlewareClass);

        middlewareMetadata.should.not.be.undefined;
        middlewareMetadata.type.should.be.equal(ATestMiddlewareRegistryErrorMiddlewareClass);
        middlewareMetadata.isErrorMiddleware.should.be.true;
        middlewareMetadata.handler.should.not.be.undefined;
        middlewareMetadata.handler.isErrorHandler.should.be.true;
    });

    it('should successfully register a Middleware with order', () => {
        const middlewares = MiddlewareRegistry.getMiddlewares({isErrorMiddleware: false});

        middlewares.should.not.be.undefined;

        const firstMiddleware = middlewares[0];

        firstMiddleware.type.should.be.equal(ATestMiddlewareRegistryMiddlewareWithOrderClass2);
        firstMiddleware.handler.should.not.be.undefined;
        firstMiddleware.order.should.be.equal(2);
        firstMiddleware.isErrorMiddleware.should.be.false;

        const secondMiddleware = middlewares[1];

        secondMiddleware.type.should.be.equal(ATestMiddlewareRegistryMiddlewareWithOrderClass1);
        secondMiddleware.handler.should.not.be.undefined;
        secondMiddleware.order.should.be.equal(19);
        secondMiddleware.isErrorMiddleware.should.be.false;

    });

    it('should successfully register a ErrorMiddleware with order', () => {
        const middlewares = MiddlewareRegistry.getMiddlewares({isErrorMiddleware: true});

        middlewares.should.not.be.undefined;

        const firstMiddleware = middlewares[0];

        firstMiddleware.type.should.be.equal(ATestMiddlewareRegistryErrorMiddlewareWithOrderClass2);
        firstMiddleware.handler.should.not.be.undefined;
        firstMiddleware.order.should.be.equal(2);
        firstMiddleware.isErrorMiddleware.should.be.true;

        const secondMiddleware = middlewares[1];

        secondMiddleware.type.should.be.equal(ATestMiddlewareRegistryErrorMiddlewareWithOrderClass1);
        secondMiddleware.handler.should.not.be.undefined;
        secondMiddleware.order.should.be.equal(19);
        secondMiddleware.isErrorMiddleware.should.be.true;
    });

    it('should successfully register a middleware with base url', () => {
        const middleware: any = MiddlewareRegistry.middlewares.get(ATestMiddlewareRegistryMiddlewareWithBaseUrlClass);

        middleware.type.should.be.equal(ATestMiddlewareRegistryMiddlewareWithBaseUrlClass);
        middleware.handler.should.not.be.undefined;
        middleware.isErrorMiddleware.should.be.false;
        middleware.baseUrl.should.be.equal("/test");
    });

    it('should successfully register a error middleware with base url', () => {
        const middleware: any = MiddlewareRegistry.middlewares.get(ATestMiddlewareRegistryErrorMiddlewareWithBaseUrlClass);

        middleware.type.should.be.equal(ATestMiddlewareRegistryErrorMiddlewareWithBaseUrlClass);
        middleware.handler.should.not.be.undefined;
        middleware.isErrorMiddleware.should.be.true;
        middleware.baseUrl.should.be.equal("/test");
    });
});