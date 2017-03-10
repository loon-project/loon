import "../../TestHelper";
import * as Express from "express";
import {RestController, Get, Post, Patch, Put, Delete} from "../../../src/index";
import {HttpHelper} from "../../helper/HttpHelper";
import {ControllerRegistry} from "../../../src/mvc/ControllerRegistry";
import {Response} from "../../../src/mvc/decorator/Params";

describe("Controller integration", () => {

    @RestController("/1")
    class User1Controller {

        @Get("/users")
        public indexAction(@Response() response: Express.Response) {
            response.send("all users");
        }

        @Post("/users")
        public createAction(@Response() response: Express.Response) {
            response.status(201).send("create user");
        }

        @Put("/users/1")
        @Patch("/users/1")
        public updateAction(@Response() response: Express.Response) {
            response.send("update user");
        }

        @Delete("/users/1")
        public destroyAction(@Response() response: Express.Response) {
            response.send("delete user");
        }
    }

    const app: Express.Application = Express();
    let server;

    before(done => {

        const routes = ControllerRegistry.getRoutes(User1Controller);

        routes.forEach((route, baseUrl) => {
            app.use(baseUrl, route);
        });

        server = app.listen(4444, done);
    });

    after(done => {
        server.close(done);
    });

    it("should response get request", () => {
        return HttpHelper.sendRequest("get", "http://localhost:4444/1/users", undefined, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal("all users");
        });
    });

    it('should response post request', () => {
        return HttpHelper.sendRequest("post", "http://localhost:4444/1/users", undefined, (response) => {
            response.statusCode.should.be.equal(201);
            response.body.should.be.equal("create user");
        });
    });

    it('should response put request', () => {
        return HttpHelper.sendRequest("put", "http://localhost:4444/1/users/1", undefined, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal("update user");
        });
    });

    it('should response patch request', () => {
        return HttpHelper.sendRequest("patch", "http://localhost:4444/1/users/1", undefined, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal("update user");
        });
    });

    it('should response delete request', () => {
        return HttpHelper.sendRequest("delete", "http://localhost:4444/1/users/1", undefined, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal("delete user");
        });
    });
});

