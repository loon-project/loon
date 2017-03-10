import "../TestHelper";
import * as Express from "express";
import {RestController} from "../../src/mvc/decorator/Controller";
import {Get, Post, Put, Patch, Delete} from "../../src/mvc/decorator/Method";
import {Res} from "../../src/mvc/decorator/Params";
import {ControllerRegistry} from "../../src/mvc/ControllerRegistry";
import {HttpHelper} from "../helper/HttpHelper";

describe("[Integration] Controller", () => {

    @RestController("/1")
    class User1Controller {

        @Get("/users")
        public indexAction(@Res() response: Express.Response) {
            response.send("all users");
        }

        @Post("/users")
        public createAction(@Res() response: Express.Response) {
            response.status(201).send("create user");
        }

        @Put("/users/1")
        @Patch("/users/1")
        public updateAction(@Res() response: Express.Response) {
            response.send("update user");
        }

        @Delete("/users/1")
        public destroyAction(@Res() response: Express.Response) {
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

