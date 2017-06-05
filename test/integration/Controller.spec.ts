import "../TestHelper";
import * as Express from "express";
import {RestController} from "../../src/mvc/decorator/Controller";
import {All, Delete, Get, Head, Options, Patch, Post, Put} from "../../src/mvc/decorator/Method";
import {Res} from "../../src/mvc/decorator/Params";
import {HttpHelper} from "../helper/HttpHelper";
import {bootstrap} from "../../src/testing/bootstrap";
import {expect} from "chai";

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

        @All("/users/allRoutes")
        public allAction(@Res() response: Express.Response) {
            response.send("all");
        }
    }

    bootstrap(User1Controller, 4444);

    it("should respond get request", async () => {
        const response = await HttpHelper.request("get", "http://localhost:4444/1/users");
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.equal("all users");
    });

    it('should respond post request', async () => {
        const response = await HttpHelper.request("post", "http://localhost:4444/1/users");
        expect(response.statusCode).to.be.equal(201);
        expect(response.body).to.be.equal("create user");
    });

    it('should respond put request', async () => {
        const response = await HttpHelper.request("put", "http://localhost:4444/1/users/1");
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.equal("update user");
    });

    it('should respond patch request', async () => {
        const response = await HttpHelper.request("patch", "http://localhost:4444/1/users/1");
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.equal("update user");
    });

    it('should respond delete request', async () => {
        const response = await HttpHelper.request("delete", "http://localhost:4444/1/users/1");
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.equal("delete user");
    });

    it('should respond head request', async () => {
        const response = await HttpHelper.request('head', "http://localhost:4444/1/users/info");
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.undefined;
    });

    it('should respond options request', async () => {
        const response = await HttpHelper.request('options', "http://localhost:4444/1/users/options");
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.equal('options');
    });

    it('should respond all request', async () => {
        const r1 = await HttpHelper.request('get', "http://localhost:4444/1/users/allRoutes");
        expect(r1.statusCode).to.be.equal(200);
        expect(r1.body).to.be.equal('all');

        const r2 = await HttpHelper.request('post', "http://localhost:4444/1/users/allRoutes");
        expect(r2.statusCode).to.be.equal(200);
        expect(r2.body).to.be.equal('all');
    });
});

