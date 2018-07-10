// import "../TestHelper";
// import {RestController, Controller, Get, Post, Put, Patch, Request, Response, NextFunction} from "../../src/index";
// import {Req, PathParam} from "../../src/mvc/decorator/Params";
// import {ControllerRegistry} from "../../src/mvc/ControllerRegistry";
// import {IMiddleware} from "../../src/mvc/interface/IMiddleware";
// import {BeforeFilter, AfterFilter, Filter} from "../../src/mvc/decorator/Filter";
// import {expect} from 'chai';


// describe("ControllerRegistry", () => {

//     @Filter()
//     class ATestFilterClass implements IMiddleware {
//         public use() {
//         }
//     }

//     @RestController("/ControllerRegistry/1")
//     @BeforeFilter(ATestFilterClass)
//     @AfterFilter(ATestFilterClass)
//     class AControllerRegistryTestRestController {

//         @Get("/")
//         public indexAction(@Req() request: Request) {
//         }

//         @Put("/api/:id/")
//         @Patch("/api/:id/2")
//         public updateAction() {
//         }
//     }

//     @Controller("ControllerRegistry/2")
//     class AControllerRegistryTestController {

//         @Post("/:id")
//         public createAction(@PathParam('id') id: number) {
//         }
//     }


//     it('should successfully register a rest controller', () => {
//         expectController(AControllerRegistryTestRestController, "/ControllerRegistry/1", true);
//     });

//     it('should successfully register a controller', () => {
//         expectController(AControllerRegistryTestController, "ControllerRegistry/2", false);
//     });

//     it('should successfully register a handler for RestController', () => {

//         const controllerMetadata: any = ControllerRegistry.controllers.get(AControllerRegistryTestRestController);
//         const handlerMetadata: any = controllerMetadata.handlers.get('indexAction');

//         expect(handlerMetadata.isErrorHandler).to.be.false;
//         expect(handlerMetadata.actionName).to.be.equal('indexAction');
//         expect(handlerMetadata.type).to.be.equal(AControllerRegistryTestRestController);
//         expect(handlerMetadata.httpMethodAndPaths.length).to.be.equal(1);
//         expect(handlerMetadata.httpMethodAndPaths[0].method).to.be.equal('get');
//         expect(handlerMetadata.httpMethodAndPaths[0].path).to.be.equal('/');

//         const handlerParamMetadata: any = handlerMetadata.params.get(0);

//         expect(handlerParamMetadata).to.not.be.undefined;
//         expect(handlerParamMetadata.type).to.be.equal(AControllerRegistryTestRestController);
//         expect(handlerParamMetadata.index).to.be.equal(0);
//         expect(handlerParamMetadata.actionName).to.be.equal('indexAction');
//     });

//     it('should successfully register a handler for Controller', () => {
//         const controllerMetadata: any = ControllerRegistry.controllers.get(AControllerRegistryTestController);
//         const handlerMetadata: any = controllerMetadata.handlers.get('createAction');

//         expect(handlerMetadata.isErrorHandler).to.be.false;
//         expect(handlerMetadata.actionName).to.be.equal('createAction');
//         expect(handlerMetadata.type).to.be.equal(AControllerRegistryTestController);
//         expect(handlerMetadata.httpMethodAndPaths.length).to.be.equal(1);
//         expect(handlerMetadata.httpMethodAndPaths[0].method).to.be.equal('post');
//         expect(handlerMetadata.httpMethodAndPaths[0].path).to.be.equal("/:id");

//         const handlerParamMetadata: any = handlerMetadata.params.get(0);

//         expect(handlerParamMetadata.type).to.be.equal(AControllerRegistryTestController);
//         expect(handlerParamMetadata.index).to.be.equal(0);
//         expect(handlerParamMetadata.actionName).to.be.equal('createAction');
//     });

//     it('should successfully register a handler with multiple http method and path', () => {

//         const controllerMetadata: any = ControllerRegistry.controllers.get(AControllerRegistryTestRestController);
//         const handlerMetadata: any = controllerMetadata.handlers.get('updateAction');

//         expect(handlerMetadata.isErrorHandler).to.be.false;
//         expect(handlerMetadata.actionName).to.be.equal('updateAction');
//         expect(handlerMetadata.type).to.be.equal(AControllerRegistryTestRestController);
//         expect(handlerMetadata.params).to.be.not.undefined;
//         expect(handlerMetadata.httpMethodAndPaths.length).to.be.equal(2);



//         const putRequest = handlerMetadata
//             .httpMethodAndPaths
//             .find(item => item.path === '/api/:id/' && item.method === 'put');

//         const patchRequest = handlerMetadata
//             .httpMethodAndPaths
//             .find(item => item.path === '/api/:id/2' && item.method === 'patch');

//         expect(putRequest).to.be.not.undefined;
//         expect(patchRequest).to.be.not.undefined;

//         const handlerParamMetadata: any = handlerMetadata.params.get(0);

//         expect(handlerParamMetadata).to.be.undefined;
//     });

//     it('should successfully register a BeforeFilter filter', () => {

//         const controllerMetadata: any = ControllerRegistry.controllers.get(AControllerRegistryTestRestController);
//         const controllerFilterMetadata: any = controllerMetadata.beforeFilters[0];
//         const filterMetadata: any = controllerFilterMetadata.filterMetadata;
//         const handlerMetadata: any = filterMetadata.handler;

//         expect(handlerMetadata.type).to.be.equal(ATestFilterClass);
//         expect(handlerMetadata.actionName).to.be.equal('use');
//         expect(handlerMetadata.httpMethodAndPaths.length).to.be.equal(0);

//     });

//     it('should successfully register a AfterFilter filter', () => {
//         const controllerMetadata: any = ControllerRegistry.controllers.get(AControllerRegistryTestRestController);
//         const controllerFilterMetadata: any = controllerMetadata.afterFilters[0];
//         const filterMetadata = controllerFilterMetadata.filterMetadata;
//         const handlerMetadata: any = filterMetadata.handler;

//         expect(handlerMetadata.type).to.be.equal(ATestFilterClass);
//         expect(handlerMetadata.actionName).to.be.equal('use');
//         expect(handlerMetadata.httpMethodAndPaths.length).to.be.equal(0);
//     });

//     function expectController(type: Function, baseUrl: string, isRest: boolean) {

//         const controllerMetadata: any = ControllerRegistry.controllers.get(type);

//         expect(controllerMetadata).to.not.be.undefined;
//         expect(controllerMetadata.type).to.be.equal(type);
//         expect(controllerMetadata.baseUrl).to.be.equal(baseUrl);
//         expect(controllerMetadata.isRest).to.be.equal(isRest);

//         return controllerMetadata;
//     }
// });