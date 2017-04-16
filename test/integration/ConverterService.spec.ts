import "../TestHelper";
import {ControllerRegistry} from "../../src/mvc/ControllerRegistry";
import {BodyParam, PathParam, QueryParam, Res} from "../../src/mvc/decorator/Params";
import {Get, Post} from "../../src/mvc/decorator/Method";
import {ServerHelper} from "../helper/ServerHelper";
import {RestController} from "../../src/mvc/decorator/Controller";
import * as Express from "express";
import {HttpHelper} from "../helper/HttpHelper";
import {ObjectProperty} from "../../src/converter/decorator/ObjectProperty";


describe('[Integration] ConverterService', () => {

    const d1 = new Date();
    const d2 = new Date();

    class Filter {

        @ObjectProperty()
        public name: string;

        @ObjectProperty({baseType: Number})
        public ids: number[];
    }

    class User {

        public name: string;

    }

    @RestController()
    class UserController {

        @Get("/users")
        public indexAction(@QueryParam("filter") filter: Filter,
                           @Res() res: Express.Response) {

            if (!(filter instanceof Filter)) {
                return res.send('1');
            }

            if (filter.name !== 'abc') {
                return res.send('2');
            }

            if (!(filter.ids instanceof Array)) {
                return res.send('3');
            }

            if (filter.ids[0] !== 1) {
                return res.send('4');
            }

            return res.send(true);
        }

        @Get("/users/:id")
        public showAction(@PathParam("id") id: number,
                          @Res() res: Express.Response) {

            const flag = id === 1;
            res.send(flag);
        }

        @Post("/users")
        public createAction(@BodyParam('user') user: User,
                            @Res() res: Express.Response) {

            const flag = user instanceof User;
            res.send(flag);
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


    it('should convert a QueryParam', () => {

        const options = {
            qs: {
                filter: {
                    name: "abc",
                    ids: [1, 2, 3]
                }
            }
        };

        return HttpHelper.sendRequest("get", "http://localhost:4444/users", options, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal(true);
        });
    });



    it('should convert in QueryParam', () => {

    });



});