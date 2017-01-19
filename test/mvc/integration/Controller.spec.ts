import "../../TestHelper";
import * as Express from "express";
import {Controller} from "../../../src/mvc/decorator/Controller";
import {Get, Post, Patch, Put, Delete} from "../../../src/mvc/decorator/Method";
import {MVCContainer} from "../../../src/mvc/MVCContainer";
import {HttpHelper} from "../../helper/HttpHelper";

describe("Controller integration", () => {

    const app: Express.Application = Express();

    @Controller()
    class UserController {

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

    before(done => {
        const routes = MVCContainer.getRoutes();
        routes.forEach(item => {
            console.log(item.baseRoute);
            app.use(item.baseRoute, item.router);
        });
        app.listen(4444, done);
    });

    it("should response get request", () => {
        return HttpHelper.sendRequest("get", "http://localhost:4444/users", undefined, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal("all users");
        });
    });

    it('should response post request', () => {
        return HttpHelper.sendRequest("post", "http://localhost:4444/users", undefined, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal("create user");
        });
    });

    it('should response put request', () => {
        return HttpHelper.sendRequest("put", "http://localhost:4444/users/1", undefined, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal("update user");
        });
    });

    it('should response patch request', () => {
        return HttpHelper.sendRequest("patch", "http://localhost:4444/users/1", undefined, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal("update user");
        });
    });

    it('should response delete request', () => {
        return HttpHelper.sendRequest("delete", "http://localhost:4444/users/1", undefined, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal("delete user");
        });
    });
});