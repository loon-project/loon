import "../../TestHelper";
import * as Express from "express";
import {RestController} from "../../../src/mvc/decorator/Controller";
import {Get, Post, Patch, Put, Delete} from "../../../src/mvc/decorator/Method";
import {MVCContainer} from "../../../src/mvc/MVCContainer";
import {HttpHelper} from "../../helper/HttpHelper";

describe("Controller integration", () => {

    @RestController("/1")
    class User1Controller {

        @Get("/users")
        public indexAction() {
            return "all users";
        }

        @Post("/users")
        public createAction() {
            return "create user";
        }

        @Put("/users/1")
        @Patch("/users/1")
        public updateAction() {
            return "update user";
        }

        @Delete("/users/1")
        public destroyAction() {
            return "delete user";
        }
    }

    const app: Express.Application = Express();
    let server;

    before(done => {
        const routes = MVCContainer.getRoutes();
        routes.forEach(item => app.use(item.baseRoute, item.router));
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