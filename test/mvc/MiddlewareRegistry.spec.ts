import "../TestHelper";
import {Middleware, ErrorMiddleware} from "../../src/mvc/decorator/Middleware";
import {IMiddleware} from "../../src/mvc/interface/IMiddleware";
import {MiddlewareRegistry} from "../../src/mvc/MiddlewareRegistry";

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

    it('should successfully register a Middleware', () => {
        const middlewareMetadata: any = MiddlewareRegistry.middlewares.get(ATestMiddlewareRegistryMiddlewareClass);

        middlewareMetadata.should.not.be.undefined;
        middlewareMetadata.type.should.be.equal(ATestMiddlewareRegistryMiddlewareClass);
        middlewareMetadata.handler.should.not.be.undefined;
        middlewareMetadata.handler.isErrorHandler.should.be.false;
    });

    it('should successfully register a ErrorMiddleware', () => {
        const middlewareMetadata: any = MiddlewareRegistry.middlewares.get(ATestMiddlewareRegistryErrorMiddlewareClass);

        middlewareMetadata.should.not.be.undefined;
        middlewareMetadata.type.should.be.equal(ATestMiddlewareRegistryErrorMiddlewareClass);
        middlewareMetadata.handler.should.not.be.undefined;
        middlewareMetadata.handler.isErrorHandler.should.be.true;
    });

});