import "../TestHelper";
import {Middleware, GlobalMiddleware} from "../../src/mvc/decorator/Middleware";
import {IMiddleware} from "../../src/mvc/interface/IMiddleware";
import {ErrorController} from "../../src/mvc/decorator/ErrorController";
import {HandlerRegistry} from "../../src/mvc/HandlerRegistry";

describe("HandlerRegistry", () => {

    @Middleware()
    class ATestHandlerRegistryMiddlewareClass implements IMiddleware {

        public use() {
        }

    }

    @GlobalMiddleware()
    class ATestHandlerRegistryGlobalMiddlewareClass implements IMiddleware {

        public use() {
        }

    }

    @ErrorController()
    class ATestHandlerRegistryErrorControllerClass implements IMiddleware {

        public use() {
        }

    }

    it('should successfully register a handler for Middleware', () => {
        middlewareShouldPass(ATestHandlerRegistryMiddlewareClass);
    });

    it('should successfully register a handler for GlobalMiddleware', () => {
        middlewareShouldPass(ATestHandlerRegistryGlobalMiddlewareClass);
    });

    it('should successfully register a handler for ErrorController', () => {
        middlewareShouldPass(ATestHandlerRegistryErrorControllerClass);
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
