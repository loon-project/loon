import "../TestHelper";
import {RestController, Controller} from "../../src/mvc/decorator/Controller";
import {Get, Post, Put, Patch} from "../../src/mvc/decorator/Method";
import {Request, PathParam} from "../../src/mvc/decorator/Params";
import {ControllerRegistry} from "../../src/mvc/ControllerRegistry";


describe("ControllerRegistry", () => {


    @RestController("/test")
    class AControllerRegistryTestRestController {

        @Get("/")
        public indexAction(@Request() request: Express.Request) {
        }

        @Put("/api/:id/")
        @Patch("/api/:id/2")
        public updateAction() {
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
        handlerMetadata.isErrorHandler.should.be.equal(false);
        handlerMetadata.actionName.should.be.equal('indexAction');
        handlerMetadata.type.should.be.equal(AControllerRegistryTestRestController);
        handlerMetadata.httpMethodAndPaths.should.not.be.undefined;
        handlerMetadata.httpMethodAndPaths.length.should.be.equal(1);
        handlerMetadata.httpMethodAndPaths[0].method.should.be.equal('get');
        handlerMetadata.httpMethodAndPaths[0].path.should.be.equal('/');
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
        handlerMetadata.isErrorHandler.should.be.equal(false);
        handlerMetadata.actionName.should.be.equal('createAction');
        handlerMetadata.type.should.be.equal(AControllerRegistryTestController);
        handlerMetadata.params.should.not.be.undefined;
        handlerMetadata.httpMethodAndPaths.should.not.be.undefined;
        handlerMetadata.httpMethodAndPaths.length.should.be.equal(1);
        handlerMetadata.httpMethodAndPaths[0].method.should.be.equal('post');
        handlerMetadata.httpMethodAndPaths[0].path.should.be.equal("/:id");

        const handlerParamMetadata: any = handlerMetadata.params.get(0);

        handlerParamMetadata.should.not.be.undefined;
        handlerParamMetadata.type.should.be.equal(AControllerRegistryTestController);
        handlerParamMetadata.index.should.be.equal(0);
        handlerParamMetadata.isRequired.should.be.equal(false);
        handlerParamMetadata.actionName.should.be.equal('createAction');
    });

    it('should successfully register a handler with multiple http method and path', () => {
        const controllerMetadata: any = ControllerRegistry.controllers.get(AControllerRegistryTestRestController);

        controllerMetadata.should.not.be.undefined;
        controllerMetadata.handlers.should.not.be.undefined;

        const handlerMetadata: any = controllerMetadata.handlers.get('updateAction');

        handlerMetadata.should.not.be.undefined;
        handlerMetadata.isErrorHandler.should.be.equal(false);
        handlerMetadata.actionName.should.be.equal('updateAction');
        handlerMetadata.type.should.be.equal(AControllerRegistryTestRestController);
        handlerMetadata.params.should.not.be.undefined;

        handlerMetadata.httpMethodAndPaths.should.not.be.undefined;
        handlerMetadata.httpMethodAndPaths.length.should.be.equal(2);
        const putRequest = handlerMetadata.httpMethodAndPaths.find(item => item.path === '/api/:id/' && item.method === 'put');
        putRequest.should.not.be.undefined;
        const patchRequest = handlerMetadata.httpMethodAndPaths.find(item => item.path === '/api/:id/2' && item.method === 'patch');
        patchRequest.should.not.be.undefined;

        const handlerParamMetadata: any = handlerMetadata.params.get(0);
        (typeof handlerParamMetadata === 'undefined').should.be.true;
    });
});