import "../TestHelper";
import * as Express from 'express';
import {RestController} from "../../src/mvc/decorator/Controller";
import {Get, Post, Patch} from "../../src/mvc/decorator/Method";
import {HeaderParam, Res, QueryParam, PathParam, BodyParam} from "../../src/mvc/decorator/Params";
import {ServerHelper} from "../helper/ServerHelper";
import {ControllerRegistry} from "../../src/mvc/ControllerRegistry";
import {HttpHelper} from "../helper/HttpHelper";
import {HttpException} from "../../src/mvc/error/HttpException";
import {expect} from 'chai';


describe("[Integration] Param", () => {

    @RestController()
    class UserController {

        @Get("/users")
        public indexAction(@HeaderParam("Authorization", {required: true}) authorization: string,
                           @Res() res: Express.Response) {

            res.send(authorization);
        }

        @Get("/users/active")
        public activeAction(@QueryParam("status", {required: true}) status: string,
                            @Res() res: Express.Response) {

            res.send(status);
        }

        @Get("/users/:id")
        public showAction(@PathParam("id", {required: true}) id: string,
                          @Res() res: Express.Response) {

            res.send(id);
        }

        @Post("/users")
        public createAction(@BodyParam("id", {required: true}) id: number,
                            @Res() res: Express.Response) {

            res.status(201).send(`${id}`);
        }

        @Patch("/users/:id")
        public updateAction(@PathParam("id", {required: true}) id: string,
                            @BodyParam("user") user: any,
                            @Res() res: Express.Response) {

            if (id === "1") {
                res.send(user.name);
            }
        }
    }


    const app = ServerHelper.simpleServer();
    let server;

    before(done => {

        const routes = ControllerRegistry.getRoutes(UserController);

        routes.forEach((router, baseUrl) => {
            app.use(baseUrl, router);
        });

        app.use((err, req, res, next) => {

            if (err instanceof HttpException) {
                res.status(err.status).send({
                    status: err.status,
                    code: err.code,
                    message: err.message,
                    stack: err.stack
                });
            } else {
                next(err);
            }
        });

        server = app.listen(4444, done);
    });

    after(done => {
        server.close(done);
    });

    const options = {
        body: {
            id: 1
        },
        headers: {
            'Authorization': 123
        },
        qs: {
            status: 'abc'
        }
    };

    it('should get HeaderParam in the action', async () => {
        const response = await HttpHelper.request("get", "http://localhost:4444/users", options);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.equal(123);
    });

    it('should return error without required field in header', async () => {
        const response = await HttpHelper.request("get", "http://localhost:4444/users");
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.status).to.be.equal(400);
        expect(response.body.code).to.be.equal('ERR_PARAM_ABSENCE');
    });

    it("should get PathParam in the action", async () => {
        const response = await HttpHelper.request("get", "http://localhost:4444/users/1", options);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.equal(1);
    });

    it('should get BodyParam in the action', async () => {
        const response = await HttpHelper.request("post", "http://localhost:4444/users", options);
        expect(response.statusCode).to.be.equal(201);
        expect(response.body).to.be.equal(1);
    });

    it('should return error without required field in body', async () => {
        const response = await HttpHelper.request("post", "http://localhost:4444/users");
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.status).to.be.equal(400);
        expect(response.body.code).to.be.equal('ERR_PARAM_ABSENCE');
    });

    it('should get QueryParam in the action', async () => {
        const response = await HttpHelper.request("get", "http://localhost:4444/users/active", options);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.equal('abc');
    });

    it('should return error without required field in query', async () => {
        const response = await HttpHelper.request("get", "http://localhost:4444/users/active");
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.status).to.be.equal(400);
        expect(response.body.code).to.be.equal('ERR_PARAM_ABSENCE');
    });

    it('should get complex object in the action', async () => {
        const options = {body: {user: {name: 'tester'}}};
        const response = await HttpHelper.request("patch", "http://localhost:4444/users/1", options);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.equal('tester');
    });
});
