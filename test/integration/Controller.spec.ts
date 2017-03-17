import "../TestHelper";
import * as Express from "express";
import {RestController} from "../../src/mvc/decorator/Controller";
import {Get, Post, Put, Patch, Delete, Head, Options} from "../../src/mvc/decorator/Method";
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

        @Head("/users/info")
        public headAction(@Res() response: Express.Response) {
            response.send('info');
        }

        @Options("/users/options")
        public optionsAction(@Res() response: Express.Response) {
            response.send('options');
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

    it("should respond get request", () => {
        return HttpHelper.sendRequest("get", "http://localhost:4444/1/users", undefined, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal("all users");
        });
    });

    it('should respond post request', () => {
        return HttpHelper.sendRequest("post", "http://localhost:4444/1/users", undefined, (response) => {
            response.statusCode.should.be.equal(201);
            response.body.should.be.equal("create user");
        });
    });

    it('should respond put request', () => {
        return HttpHelper.sendRequest("put", "http://localhost:4444/1/users/1", undefined, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal("update user");
        });
    });

    it('should respond patch request', () => {
        return HttpHelper.sendRequest("patch", "http://localhost:4444/1/users/1", undefined, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal("update user");
        });
    });

    it('should respond delete request', () => {
        return HttpHelper.sendRequest("delete", "http://localhost:4444/1/users/1", undefined, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal("delete user");
        });
    });

    it('should respond head request', () => {
        return HttpHelper.sendRequest('head', "http://localhost:4444/1/users/info", undefined, response => {
            response.statusCode.should.be.equal(200);
            (typeof response.body === 'undefined').should.be.true;
        });
    });

    it('should respond options request', () => {
        return HttpHelper.sendRequest('options', "http://localhost:4444/1/users/options", undefined, response => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal('options');
        });
    });
});

