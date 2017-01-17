import "../../TestHelper";
import {Controller} from "../../../src/http/decorator/Controller";
import {Get, Post, Put, Patch, Delete} from "../../../src/http/decorator/Method";


describe("Controller integration", () => {

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

        @Get("/users/db")
        public async indexDBAction(): Promise<any> {
            function query() {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve([{username: "aaa"}]);
                    }, 500);
                });
            }


            return await query();
        }

    }

});