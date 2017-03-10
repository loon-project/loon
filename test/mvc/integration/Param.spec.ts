import "../../TestHelper";
import {Get, Post, RestController, PathParam, BodyParam, HeaderParam, QueryParam} from "../../../src/index";
import {ServerHelper} from "../../helper/ServerHelper";
import {HttpHelper} from "../../helper/HttpHelper";
import {ControllerRegistry} from "../../../src/mvc/ControllerRegistry";
import * as Express from 'express';
import {Res} from "../../../src/mvc/decorator/Params";
import {Patch} from "../../../src/mvc/decorator/Method";


describe("[Integration] Param", () => {

    @RestController()
    class UserController {

        @Get("/users")
        public indexAction(@HeaderParam("Authorization") authorization: string, @Res() res: Express.Response) {
            res.send(authorization);
        }

        @Get("/users/active")
        public activeAction(@QueryParam("status") status: string, @Res() res: Express.Response) {
            res.send(status);
        }

        @Get("/users/:id")
        public showAction(@PathParam("id") id: string, @Res() res: Express.Response) {
            res.send(id);
        }

        @Post("/users")
        public createAction(@BodyParam("id") id: number, @Res() res: Express.Response) {
            res.status(201).send(`${id}`);
        }

        @Patch("/users/:id")
        public updateAction(@PathParam("id") id: string, @BodyParam("user") user: any, @Res() res: Express.Response) {
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

    it("should get PathParam in the action", () => {
        return HttpHelper.sendRequest("get", "http://localhost:4444/users/1", options, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal(1);
        });
    });

    it('should get BodyParam in the action', () => {
        return HttpHelper.sendRequest("post", "http://localhost:4444/users", options, (response) => {
            response.statusCode.should.be.equal(201);
            response.body.should.be.equal(1);
        });
    });

    it('should get QueryParam in the action', () => {
        return HttpHelper.sendRequest("get", "http://localhost:4444/users/active", options, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal('abc');
        });
    });

    it('should get complex object in the action', () => {
        return HttpHelper.sendRequest("patch", "http://localhost:4444/users/1", {body: {user: {name: 'tester'}}}, response => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal("tester");
        });
    });
});
