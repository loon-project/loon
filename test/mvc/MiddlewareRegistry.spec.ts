import "../TestHelper";
import {Middleware, GlobalMiddleware} from "../../src/mvc/decorator/Middleware";
import {IMiddleware} from "../../src/mvc/interface/IMiddleware";
import {MiddlewareRegistry} from "../../src/mvc/MiddlewareRegistry";

describe("MiddlewareRegistry", () => {

    @Middleware()
    class ATestMiddlewareRegistryMiddlewareClass implements IMiddleware {

        public use() {
        }
    }

    @GlobalMiddleware()
    class ATestMiddlewareRegistryGlobalMiddlewareClass implements IMiddleware {

        public use() {
        }
    }

    it('should successfully register a Middleware', () => {
        const middlewareMetadata: any = MiddlewareRegistry.middlewares.get(ATestMiddlewareRegistryMiddlewareClass);

        middlewareMetadata.should.not.be.undefined;
        middlewareMetadata.type.should.be.equal(ATestMiddlewareRegistryMiddlewareClass);
        middlewareMetadata.isGlobalMiddleware.should.be.false;
        middlewareMetadata.handler.should.not.be.undefined;
    });

    it('should successfully register a GlobalMiddleware', () => {
        const middlewareMetadata: any = MiddlewareRegistry.middlewares.get(ATestMiddlewareRegistryGlobalMiddlewareClass);

        middlewareMetadata.should.not.be.undefined;
        middlewareMetadata.type.should.be.equal(ATestMiddlewareRegistryGlobalMiddlewareClass);
        middlewareMetadata.isGlobalMiddleware.should.be.true;
        middlewareMetadata.handler.should.not.be.undefined;
    });

});