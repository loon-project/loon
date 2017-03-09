import "../TestHelper";
import {RestController, Controller} from "../../src/mvc/decorator/Controller";
import {Get, Post, Put, Patch} from "../../src/mvc/decorator/Method";
import {Request, PathParam} from "../../src/mvc/decorator/Params";
import {ControllerRegistry} from "../../src/mvc/ControllerRegistry";
import {GlobalMiddleware, GlobalErrorMiddleware, Middleware, ErrorMiddleware} from "../../src/mvc/decorator/Middleware";
import {IMiddleware} from "../../src/mvc/interface/IMiddleware";
import {BeforeAction, AfterAction, ErrorAction} from "../../src/mvc/decorator/Action";
import {MiddlewareLevel} from "../../src/mvc/enum/MiddlewareLevel";
import {MiddlewareType} from "../../src/mvc/enum/MiddlewareType";


describe("ControllerRegistry", () => {

    @GlobalMiddleware()
    class ATestGlobalMiddlewareClass implements IMiddleware {
        public use() {
        }
    }

    @GlobalErrorMiddleware()
    class ATestGlobalErrorMiddlewareClass implements IMiddleware {
        public use() {
        }
    }

    @Middleware()
    class ATestMiddlewareClass implements IMiddleware {
        public use() {
        }
    }

    @ErrorMiddleware()
    class ATestErrorMiddlewareClass implements IMiddleware {
        public use() {
        }
    }

    @RestController("/test")
    @BeforeAction(ATestMiddlewareClass)
    @AfterAction(ATestMiddlewareClass)
    @ErrorAction(ATestErrorMiddlewareClass)
    class AControllerRegistryTestRestController {

        @Get("/")
        @BeforeAction(ATestMiddlewareClass)
        @AfterAction(ATestMiddlewareClass)
        @ErrorAction(ATestErrorMiddlewareClass)
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

    it('should successfully register a global middleware', () => {
        middlewareShouldPass(ATestGlobalMiddlewareClass, true, false);
    });

    it('should successfully register a global error middleware', () => {
        middlewareShouldPass(ATestGlobalErrorMiddlewareClass, true, true);
    });

    it('should successfully register a middleware', () => {
        middlewareShouldPass(ATestMiddlewareClass, false, false);
    });

    it('should successfully register a error middleware', () => {
        middlewareShouldPass(ATestErrorMiddlewareClass, false, true);
    });

    it('should successfully register a controller level before action', () => {
        registerMiddlewareShouldPass(AControllerRegistryTestRestController, ATestMiddlewareClass, MiddlewareLevel.Controller, MiddlewareType.BeforeAction);
    });

    it('should successfully register a controller level after action', () => {
        registerMiddlewareShouldPass(AControllerRegistryTestRestController, ATestMiddlewareClass, MiddlewareLevel.Controller, MiddlewareType.AfterAction);
    });

    it('should successfully register a controller level error action', () => {
        registerMiddlewareShouldPass(AControllerRegistryTestRestController, ATestErrorMiddlewareClass, MiddlewareLevel.Controller, MiddlewareType.ErrorAction);
    });

    it('should successfully register a action level before action', () => {
        registerMiddlewareShouldPass(AControllerRegistryTestRestController, ATestMiddlewareClass, MiddlewareLevel.Action, MiddlewareType.BeforeAction);
    });

    it('should successfully register a action level after action', () => {
        registerMiddlewareShouldPass(AControllerRegistryTestRestController, ATestMiddlewareClass, MiddlewareLevel.Action, MiddlewareType.AfterAction);
    });

    it('should successfully register a action level error action', () => {
        registerMiddlewareShouldPass(AControllerRegistryTestRestController, ATestErrorMiddlewareClass, MiddlewareLevel.Action, MiddlewareType.ErrorAction);
    });

    const registerMiddlewareShouldPass = (controllerType: Function, type: Function, middlewareLevel: MiddlewareLevel, middlewareType: MiddlewareType) => {

        const controllerMetadata: any = ControllerRegistry.controllers.get(controllerType);

        controllerMetadata.should.not.be.undefined;

        let middlewareTypeString = "";
        let isError = false;
        let store;

        switch (middlewareType) {
            case MiddlewareType.BeforeAction:
                middlewareTypeString = 'beforeActions';
                break;
            case MiddlewareType.AfterAction:
                middlewareTypeString = 'afterActions';
                break;
            case MiddlewareType.ErrorAction:
                middlewareTypeString = 'errorActions';
                isError = true;
                break;
        }

        switch (middlewareLevel) {
            case MiddlewareLevel.Controller:
                store = controllerMetadata;
                break;
            case MiddlewareLevel.Action:
                store = controllerMetadata.handlers.get('indexAction');
                break;
        }

        store[middlewareTypeString].should.not.be.undefined;
        store[middlewareTypeString].length.should.be.equal(1);

        const middlewareMetadata = store[middlewareTypeString][0];

        middlewareMetadata.should.not.be.undefined;
        middlewareMetadata.type.should.be.equal(type);

        middlewareShouldPass(middlewareMetadata.type, false, isError);
    };

    const middlewareShouldPass = (type: Function, isGlobal: boolean, isError: boolean) => {

        const middlewareMetadata: any = ControllerRegistry.middlewares.get(type);

        middlewareMetadata.should.not.be.undefined;
        middlewareMetadata.type.should.be.equal(type);
        middlewareMetadata.isGlobalMiddleware.should.be.equal(isGlobal);
        middlewareMetadata.isErrorMiddleware.should.be.equal(isError);
        middlewareMetadata.handler.should.not.be.undefined;

        const handlerMetadata: any = middlewareMetadata.handler;

        handlerMetadata.type.should.be.equal(type);
        handlerMetadata.actionName.should.be.equal('use');
        handlerMetadata.httpMethodAndPaths.length.should.be.equal(0);

        return middlewareMetadata;
    };
});