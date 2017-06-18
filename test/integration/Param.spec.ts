import "../TestHelper";
import * as Express from 'express';
import {RestController} from "../../src/mvc/decorator/Controller";
import {Get, Post, Patch} from "../../src/mvc/decorator/Method";
import {HeaderParam, Res, QueryParam, PathParam, BodyParam} from "../../src/mvc/decorator/Params";
import {ServerHelper} from "../helper/ServerHelper";
import {ControllerRegistry} from "../../src/mvc/ControllerRegistry";
import {HttpHelper} from "../helper/HttpHelper";
import {HttpException} from "../../src/mvc/error/HttpException";


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

    it('should get HeaderParam in the action', () => {
        return HttpHelper.sendRequest("get", "http://localhost:4444/users", options, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal(123);
        });
    });

    it('should return error without required field in header', () => {
        return HttpHelper.sendRequest("get", "http://localhost:4444/users", undefined, (response) => {
            response.statusCode.should.be.equal(400);
            response.body.status.should.be.equal(400);
            response.body.code.should.be.equal('ERR_PARAM_ABSENCE');
        });
    });

    it("should get PathParam in the action", () => {
        return HttpHelper.sendRequest("get", "http://localhost:4444/users/1", options, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal(1);
        });
    });

    it("should return error without required field in path", () => {
        // return HttpHelper.sendRequest("get", "http://localhost:4444/users/1", undefined, (response) => {
        //     response.statusCode.should.be.equal(400);
        //     response.body.status.should.be.equal(400);
        //     response.body.code.should.be.equal('ERR_PARAM_ABSENCE');
        //     response.body.message.should.be.equal('parameter id is absence');
        // });
    });

    it('should get BodyParam in the action', () => {
        return HttpHelper.sendRequest("post", "http://localhost:4444/users", options, (response) => {
            response.statusCode.should.be.equal(201);
            response.body.should.be.equal(1);
        });
    });

    it('should return error without required field in body', () => {
        return HttpHelper.sendRequest("post", "http://localhost:4444/users", undefined, (response) => {
            response.statusCode.should.be.equal(400);
            response.body.status.should.be.equal(400);
            response.body.code.should.be.equal('ERR_PARAM_ABSENCE');
        });
    });

    it('should get QueryParam in the action', () => {
        return HttpHelper.sendRequest("get", "http://localhost:4444/users/active", options, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal('abc');
        });
    });

    it('should return error without required field in query', () => {
        return HttpHelper.sendRequest("get", "http://localhost:4444/users/active", undefined, (response) => {
            response.statusCode.should.be.equal(400);
            response.body.status.should.be.equal(400);
            response.body.code.should.be.equal('ERR_PARAM_ABSENCE');
        });
    });

    it('should get complex object in the action', () => {
        return HttpHelper.sendRequest("patch", "http://localhost:4444/users/1", {body: {user: {name: 'tester'}}}, response => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal("tester");
        });
    });
});
