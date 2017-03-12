// import "../TestHelper";
// import * as Express from "express";
// import {Next, Res} from "../../src/mvc/decorator/Params";
// import {IMiddleware} from "../../src/mvc/interface/IMiddleware";
// import {Middleware} from "../../src/mvc/decorator/Middleware";
// import {RestController} from "../../src/mvc/decorator/Controller";
// import {BeforeAction, AfterAction} from "../../src/mvc/decorator/Action";
// import {Get} from "../../src/mvc/decorator/Method";
// import {ControllerRegistry} from "../../src/mvc/ControllerRegistry";
// import {HttpHelper} from "../helper/HttpHelper";
//
// describe("[Integration] Middleware", () => {
//
//     @Middleware()
//     class TestMiddleware implements IMiddleware {
//
//         public use(@Res() response: Express.Response, @Next() next: Express.NextFunction) {
//             response.locals._test1 = "1";
//             next();
//         }
//     }
//
//     @Middleware()
//     class TestSendMiddleware implements IMiddleware {
//
//         public use(@Res() res: Express.Response) {
//             res.send(res.locals._test1);
//         }
//     }
//
//     @RestController("/1")
//     @BeforeAction(TestMiddleware)
//     class User1Controller {
//
//         @Get("/users")
//         public indexAction(@Res() response: Express.Response) {
//             response.send(response.locals._test1);
//         }
//
//         @Get("/users/show")
//         public showAction(@Res() response: Express.Response) {
//             response.send(response.locals._test1);
//         }
//     }
//
//     @RestController("/3")
//     @AfterAction(TestSendMiddleware)
//     class User3Controller {
//
//         @Get("/users")
//         public indexAction(@Res() response: Express.Response, @Next() next: Express.NextFunction) {
//             response.locals._test1 = "1";
//             next();
//         }
//
//         @Get("/users/show")
//         public showAction(@Res() response: Express.Response, @Next() next: Express.NextFunction) {
//             response.locals._test1 = "1";
//             next();
//         }
//     }
//
//     const app: Express.Application = Express();
//     let server;
//
//     before(done => {
//
//         [
//             User1Controller, User2Controller,
//             User3Controller, User4Controller
//         ].map(controller => {
//
//             const routes = ControllerRegistry.getRoutes(controller);
//
//             routes.forEach((router, baseUrl) => {
//                 app.use(baseUrl, router);
//             });
//
//         });
//
//         server = app.listen(4444, done);
//     });
//
//     after(done => {
//         server.close(done);
//     });
//
//
//     it('should successfully use controller level BeforeAction middleware', () => {
//         return HttpHelper.sendRequest("get", "http://localhost:4444/1/users", undefined, (response) => {
//             response.statusCode.should.be.equal(200);
//             response.body.should.be.equal(1);
//         });
//     });
//
//     it('should successfully use controller level BeforeAction middleware for all actions', () => {
//         return HttpHelper.sendRequest("get", "http://localhost:4444/1/users/show", undefined, (response) => {
//             response.statusCode.should.be.equal(200);
//             response.body.should.be.equal(1);
//         });
//     });
//
//     it('should successfully use action level BeforeAction middleware', () => {
//         return HttpHelper.sendRequest("get", "http://localhost:4444/2/users", undefined, (response) => {
//             response.statusCode.should.be.equal(200);
//             response.body.should.be.equal(1);
//         });
//     });
//
//     it('should successfully use action level BeforeAction middleware only for registered action', () => {
//         return HttpHelper.sendRequest("get", "http://localhost:4444/2/users/show", undefined, (response) => {
//             response.statusCode.should.be.equal(200);
//             (typeof response.body === 'undefined').should.be.true;
//         });
//     });
//
//     it('should successfully use controller level AfterAction middleware', () => {
//         return HttpHelper.sendRequest("get", "http://localhost:4444/3/users", undefined, (response) => {
//             response.statusCode.should.be.equal(200);
//             response.body.should.be.equal(1);
//         });
//     });
//
//     it('should successfully use controller level AfterAction middleware for all actions', () => {
//         return HttpHelper.sendRequest("get", "http://localhost:4444/3/users/show", undefined, (response) => {
//             response.statusCode.should.be.equal(200);
//             response.body.should.be.equal(1);
//         });
//     });
//
//     it('should successfully use action level AfterAction middleware', () => {
//         return HttpHelper.sendRequest("get", "http://localhost:4444/4/users", undefined, (response) => {
//             response.statusCode.should.be.equal(200);
//             response.body.should.be.equal(1);
//         });
//     });
//
//     it('should successfully use action level AfterAction middleware only for registered action', () => {
//         return HttpHelper.sendRequest("get", "http://localhost:4444/4/users/show", undefined, (response) => {
//             response.statusCode.should.be.equal(404);
//         });
//     });
// });