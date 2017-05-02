import "../TestHelper";
import * as Express from "express";
import {Middleware, ErrorMiddleware} from "../../src/mvc/decorator/Middleware";
import {IMiddleware} from "../../src/mvc/interface/IMiddleware";
import {Res, Next, Data, Err} from "../../src/mvc/decorator/Params";
import {RestController} from "../../src/mvc/decorator/Controller";
import {Get} from "../../src/mvc/decorator/Method";
import {MiddlewareRegistry} from "../../src/mvc/MiddlewareRegistry";
import {ControllerRegistry} from "../../src/mvc/ControllerRegistry";
import {HandlerTransformer} from "../../src/mvc/HandlerTransformer";
import {HttpHelper} from "../helper/HttpHelper";
import {expect} from 'chai';

describe("[Integration] Middleware", () => {

    @Middleware()
    class GlobalMiddleware implements IMiddleware {

        public use(@Data() data: any, @Next() next: Express.NextFunction) {
            data.message = 'global';
            next();
        }
    }

    @Middleware({baseUrl: "/user"})
    class GlobalPartialMiddleware implements IMiddleware {

        public use(@Data() data: any, @Next() next: Express.NextFunction) {
            data.message = 'partial';
            next();
        }
    }

    @ErrorMiddleware()
    class GlobalErrorMiddleware implements IMiddleware {

        public use(@Err() err: any, @Res() res: Express.Response) {
            res.send(err.message);
        }
    }

    @RestController()
    class UserController {

        @Get("/")
        public indexAction(@Data() data: any, @Res() res: Express.Response) {
            res.send(data.message);
        }

        @Get("/users")
        public indexUsersAction(@Next() next: Express.NextFunction) {
            try {
                throw new Error("no user found");
            } catch (e) {
                next(e);
            }
        }

        @Get("/user/1")
        public showAction(@Data() data: any, @Res() res: Express.Response) {
            res.send(data.message);
        }
    }


    const app: Express.Application = Express();
    let server;

    before(done => {

        [GlobalMiddleware, GlobalPartialMiddleware].forEach(middleware => {
            const middlewareMetadata = MiddlewareRegistry.getMiddleware(middleware);
            const middlewareHandler = new HandlerTransformer(middlewareMetadata.handler).transform();
            app.use(middlewareMetadata.baseUrl, middlewareHandler);
        });



        const routes = ControllerRegistry.getRoutes(UserController);

        routes.forEach((router, baseUrl) => {
            app.use(baseUrl, router);
        });

        const errorMiddlewareMetadata = MiddlewareRegistry.getMiddleware(GlobalErrorMiddleware);
        const errorMiddlewareHandler = new HandlerTransformer(errorMiddlewareMetadata.handler).transform();
        app.use(errorMiddlewareMetadata.baseUrl, errorMiddlewareHandler);

        server = app.listen(4444, done);
    });

    after(done => {
        server.close(done);
    });

    it("should use global middleware", async () => {
        const response = await HttpHelper.request("get", "http://localhost:4444/");
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.equal('global');
    });

    it('should use global error middleware', async () => {
        const response = await HttpHelper.request("get", "http://localhost:4444/users");
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.equal('no user found');
    });

    it('should use baseUrl option for middleware', async () => {
        const response = await HttpHelper.request("get", "http://localhost:4444/user/1");
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.equal("partial");
    });

});