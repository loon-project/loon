import "../TestHelper";
import {RestController, Controller} from "../../src/mvc/decorator/Controller";
import {Get, Post} from "../../src/mvc/decorator/Method";
import {Request, BodyParam, PathParam} from "../../src/mvc/decorator/Params";
import {ControllerRegistry} from "../../src/mvc/ControllerRegistry";


describe("ControllerRegistry", () => {


    @RestController("/test")
    class AControllerRegistryTestRestController {

        @Get("/")
        public indexAction(@Request() request: Express.Request) {
        }
    }

    @Controller()
    class AControllerRegistryTestController {

        @Post("/:id")
        public createAction(@PathParam('id') id: number) {
        }
    }

    it('should successfully register a rest controller', () => {
        const controllerMetadata: any = ControllerRegistry.controllers.get(AControllerRegistryTestRestController);

        controllerMetadata.should.not.be.undefined;
        controllerMetadata.type.should.be.equal(AControllerRegistryTestRestController);
        controllerMetadata.baseUrl.should.be.equal("/test");
        controllerMetadata.isRest.should.be.equal(true);
    });

    it('should successfully register a controller', () => {
        const controllerMetadata: any = ControllerRegistry.controllers.get(AControllerRegistryTestController);

        controllerMetadata.should.not.be.undefined;
        controllerMetadata.type.should.be.equal(AControllerRegistryTestController);
        controllerMetadata.baseUrl.should.be.equal("");
        controllerMetadata.isRest.should.be.equal(false);
    });

    it('should successfully register a handler for RestController', () => {
        const controllerMetadata: any = ControllerRegistry.controllers.get(AControllerRegistryTestRestController);

        controllerMetadata.should.not.be.undefined;
        controllerMetadata.handlers.should.not.be.undefined;

        const handlerMetadata: any = controllerMetadata.handlers.get('indexAction');

        handlerMetadata.should.not.be.undefined;
        handlerMetadata.httpMethod.should.be.equal('get');
        handlerMetadata.isErrorHandler.should.be.equal(false);
        handlerMetadata.actionName.should.be.equal('indexAction');
        handlerMetadata.type.should.be.equal(AControllerRegistryTestRestController);
        handlerMetadata.path.should.be.equal("/");
        handlerMetadata.params.should.not.be.undefined;

        const handlerParamMetadata: any = handlerMetadata.params.get(0);

        handlerParamMetadata.should.not.be.undefined;
        handlerParamMetadata.type.should.be.equal(AControllerRegistryTestRestController);
        handlerParamMetadata.index.should.be.equal(0);
        handlerParamMetadata.isRequired.should.be.equal(false);
        handlerParamMetadata.actionName.should.be.equal('indexAction');
    });

    it('should successfully register a handler for Controller', () => {
        const controllerMetadata: any = ControllerRegistry.controllers.get(AControllerRegistryTestController);

        controllerMetadata.should.not.be.undefined;
        controllerMetadata.handlers.should.not.be.undefined;

        const handlerMetadata: any = controllerMetadata.handlers.get('createAction');

        handlerMetadata.should.not.be.undefined;
        handlerMetadata.httpMethod.should.be.equal('post');
        handlerMetadata.isErrorHandler.should.be.equal(false);
        handlerMetadata.actionName.should.be.equal('createAction');
        handlerMetadata.type.should.be.equal(AControllerRegistryTestController);
        handlerMetadata.path.should.be.equal("/:id");
        handlerMetadata.params.should.not.be.undefined;

        const handlerParamMetadata: any = handlerMetadata.params.get(0);

        handlerParamMetadata.should.not.be.undefined;
        handlerParamMetadata.type.should.be.equal(AControllerRegistryTestController);
        handlerParamMetadata.index.should.be.equal(0);
        handlerParamMetadata.isRequired.should.be.equal(false);
        handlerParamMetadata.actionName.should.be.equal('createAction');
    });
});