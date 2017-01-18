import "../../TestHelper";
import * as Express from "express";
import {Controller} from "../../../src/mvc/decorator/Controller";
import {Get} from "../../../src/mvc/decorator/Method";
import {BodyParam, PathParam, Request, Response} from "../../../src/mvc/decorator/Params";
import {MVCContainer} from "../../../src/mvc/MVCContainer";


describe("Controller integration", () => {

    @Controller()
    class UserController {

        @Get("/users/:id")
        public indexAction(@PathParam("id") id: number,
                           @Request() request: Express.Request,
                           @Response() response: Express.Response) {

            console.log(id);
            console.log(request);
            console.log(response);

            return "all users";
        }

        // @Post("/users")
        // public createAction() {
        //     return "create user";
        // }
        //
        // @Put("/users/1")
        // @Patch("/users/1")
        // public updateAction() {
        //     return "update user";
        // }
        //
        // @Delete("users/1")
        // public destroyAction() {
        //     return "delete user";
        // }

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

    it("should get routes from MVCContainer", () => {

        MVCContainer.getRoutes().should.be.is("array");

    });
});