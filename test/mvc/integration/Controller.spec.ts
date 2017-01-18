import "../../TestHelper";
import * as Express from "express";
import * as Chakram from "chakram";
import {Controller} from "../../../src/mvc/decorator/Controller";
import {Get, Post, Patch, Put, Delete} from "../../../src/mvc/decorator/Method";
import {MVCContainer} from "../../../src/mvc/MVCContainer";
import {HttpHelper} from "../../helper/HttpHelper";

const expect = Chakram.expect;



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

        @Delete("users/1")
        public destroyAction() {
            return "delete user";
        }

        // @Get("/users/db")
        // public async indexDBAction(): Promise<any> {
        //     function query() {
        //         return new Promise((resolve, reject) => {
        //             setTimeout(() => {
        //                 resolve([{username: "aaa"}]);
        //             }, 500);
        //         });
        //     }
        //
        //
        //     return await query();
        // }

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
        return HttpHelper.sendRequest("get", "http://localhost:4444/users", (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal("all users");
        });
    });

    it('should response post request', () => {
        return HttpHelper.sendRequest("post", "http://localhost:4444/users", (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal("create user");
        });
    });
});