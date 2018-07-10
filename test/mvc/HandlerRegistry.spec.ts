import "../TestHelper";
import {Middleware, ErrorMiddleware} from "../../src/mvc/decorator/Middleware";
import {IMiddleware} from "../../src/mvc/interface/IMiddleware";
import {HandlerRegistry} from "../../src/mvc/HandlerRegistry";
import {Filter} from "../../src/mvc/decorator/Filter";
import {expect} from 'chai';
import { Next } from '../../src'
import { MiddlewareRegistry } from "../../src/mvc/MiddlewareRegistry";

describe("HandlerRegistry", () => {

    @Middleware()
    class ATestHandlerRegistryMiddlewareClass implements IMiddleware {
        public use(@Next() next) {
            next()
        }
    }

    @ErrorMiddleware()
    class ATestHandlerRegistryErrorMiddlewareClass implements IMiddleware {
        public use(@Next() next) {
            next()
        }
    }

    @Filter()
    class ATestHandlerRegistryFilterClass implements IMiddleware {
        public use(@Next() next) {
            next()
        }
    }

    after(done => {
        [
            ATestHandlerRegistryMiddlewareClass, 
            ATestHandlerRegistryErrorMiddlewareClass
        ].forEach(type => MiddlewareRegistry.unregister(type))
        done()
    })

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
        const handlerMetadata = handlerStore.get('use');

        expect(handlerMetadata.type).to.be.equal(type);
        expect(handlerMetadata.httpMethodAndPaths.length).to.be.equal(0);
    };
});
