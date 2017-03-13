import "../TestHelper";
import {RestController} from "../../src/mvc/decorator/Controller";
import {Filter, BeforeFilter, AfterFilter} from "../../src/mvc/decorator/Filter";
import {IMiddleware} from "../../src/mvc/interface/IMiddleware";
import {Data, Next, Res} from "../../src/mvc/decorator/Params";
import * as Express from 'express';
import {Get} from "../../src/mvc/decorator/Method";
import {ControllerRegistry} from "../../src/mvc/ControllerRegistry";
import {HttpHelper} from "../helper/HttpHelper";

describe("Filter integration", () => {

    @Filter()
    class UserFilter implements IMiddleware {

        public use(@Data() data: any, @Next() next: Express.NextFunction) {
            data.username = "Jack";
            next();
        }
    }

    @Filter()
    class RenderFilter implements IMiddleware {

        public use(@Data() data: any, @Res() res: Express.Response) {
            res.send(data);
        }
    }

    @Filter()
    class ChangeFilter implements IMiddleware {

        public use(@Data() data: any, @Next() next: Express.NextFunction) {
            data.changed = true;
            next();
        }
    }

    @RestController()
    @BeforeFilter(UserFilter)
    @AfterFilter(RenderFilter)
    class UsersController {

        @Get("/users")
        public indexAction(@Data() data: any, @Res() res: Express.Response) {
            res.send(data.username);
        }

        @Get("/users/1")
        public showAction(@Data() data: any, @Next() next: Express.NextFunction) {
            data.username = "Hill";
            next();
        }
    }

    @RestController("/2")
    @BeforeFilter(ChangeFilter, {only: ['show1Action']})
    class Users2Controller {

        @Get("/users1")
        public show1Action(@Data() data: any, @Res() res: Express.Response) {
            res.send(data);
        }

        @Get("/users2")
        public show2Action(@Data() data: any, @Res() res: Express.Response) {
            res.send(data);
        }

    }

    @RestController("/3")
    @BeforeFilter(ChangeFilter, {except: ['show2Action']})
    class Users3Controller {

        @Get("/users1")
        public show1Action(@Data() data: any, @Res() res: Express.Response) {
            res.send(data);
        }

        @Get("/users2")
        public show2Action(@Data() data: any, @Res() res: Express.Response) {
            res.send(data);
        }

    }


    const app: Express.Application = Express();
    let server;

    before(done => {

        [UsersController, Users2Controller, Users3Controller].map(controller => {

            const routes = ControllerRegistry.getRoutes(controller);

            routes.forEach((route, baseUrl) => {
                app.use(baseUrl, route);
            });
        });


        server = app.listen(4444, done);
    });

    after(done => {
        server.close(done);
    });

    it('should successfully use BeforeFilter', () => {
        return HttpHelper.sendRequest("get", "http://localhost:4444/users", undefined, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal("Jack");
        });
    });

    it('should successfully use AfterFilter', () => {
        return HttpHelper.sendRequest("get", "http://localhost:4444/users/1", undefined, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.deep.equal({username: "Hill"});
        });
    });

    it('should trigger Filter with action in the only FilterOptions', () => {
        return HttpHelper.sendRequest("get", "http://localhost:4444/2/users1", undefined, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.deep.equal({changed: true});
        });
    });

    it('should not trigger Filter without action in the only FilterOptions', () => {
        return HttpHelper.sendRequest("get", "http://localhost:4444/2/users2", undefined, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.deep.equal({});
        });
    });

    it('should not trigger Filter with action in the except FilterOptions', () => {
        return HttpHelper.sendRequest("get", "http://localhost:4444/3/users1", undefined, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.deep.equal({changed: true});
        });
    });

    it('should trigger Filter without action in the except FilterOptions', () => {
        return HttpHelper.sendRequest("get", "http://localhost:4444/3/users2", undefined, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.deep.equal({});
        });
    });
});