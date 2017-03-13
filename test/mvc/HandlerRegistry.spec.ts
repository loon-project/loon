import "../TestHelper";
import {Middleware, ErrorMiddleware} from "../../src/mvc/decorator/Middleware";
import {IMiddleware} from "../../src/mvc/interface/IMiddleware";
import {HandlerRegistry} from "../../src/mvc/HandlerRegistry";
import {Filter} from "../../src/mvc/decorator/Filter";

describe("HandlerRegistry", () => {

    @Middleware()
    class ATestHandlerRegistryMiddlewareClass implements IMiddleware {

        public use() {
        }

    }

    @ErrorMiddleware()
    class ATestHandlerRegistryErrorMiddlewareClass implements IMiddleware {

        public use() {
        }
    }

    @Filter()
    class ATestHandlerRegistryFilterClass implements IMiddleware {

        public use() {
        }
    }

   it('should successfully register a handler for Middleware', () => {
        middlewareShouldPass(ATestHandlerRegistryMiddlewareClass);
    });

    it('should successfully register a handler for ErrorMiddleware', () => {
        middlewareShouldPass(ATestHandlerRegistryErrorMiddlewareClass);
    });

    it('should successfully register a handler for Filter', () => {
        middlewareShouldPass(ATestHandlerRegistryFilterClass);
    });

    const middlewareShouldPass = (type: Function) => {
        const handlerStore: any = HandlerRegistry.handlers.get(type);

        handlerStore.should.not.be.undefined;

        const handlerMetadata = handlerStore.get('use');

        handlerMetadata.should.not.be.undefined;
        handlerMetadata.type.should.be.equal(type);
        handlerMetadata.httpMethodAndPaths.length.should.be.equal(0);
    };
});
