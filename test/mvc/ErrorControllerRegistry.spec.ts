import "../TestHelper";
import {IMiddleware} from "../../src/mvc/interface/IMiddleware";
import {ErrorController} from "../../src/mvc/decorator/ErrorController";
import {ErrorControllerRegistry} from "../../src/mvc/ErrorControllerRegistry";

describe("ErrorControllerRegistry", () => {

    @ErrorController()
    class ATestErrorControllerRegistryErrorControllerClass implements IMiddleware {

        public use() {
        }
    }

    @ErrorController("/test")
    class ATestErrorControllerRegistryErrorControllerForUrlClass implements IMiddleware {

        public use() {
        }
    }

    it('should successfully register a ErrorController', () => {
        const errorController: any = ErrorControllerRegistry.errorControllers.get(ATestErrorControllerRegistryErrorControllerClass);

        errorController.should.not.be.undefined;
        errorController.type.should.be.equal(ATestErrorControllerRegistryErrorControllerClass);
        errorController.handler.should.not.be.undefined;
        errorController.baseUrl.should.be.equal("");
    });

    it('should successfully register a ErrorController for a specific url', () => {
        const errorController: any = ErrorControllerRegistry.errorControllers.get(ATestErrorControllerRegistryErrorControllerForUrlClass);

        errorController.should.not.be.undefined;
        errorController.type.should.be.equal(ATestErrorControllerRegistryErrorControllerForUrlClass);
        errorController.handler.should.not.be.undefined;
        errorController.baseUrl.should.be.equal("/test");
    });

});