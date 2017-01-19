import "../../TestHelper";
import {Get, Post} from "../../../src/mvc/decorator/Method";
import {Controller} from "../../../src/mvc/decorator/Controller";
import {PathParam, BodyParam, HeaderParam, QueryParam} from "../../../src/mvc/decorator/Params";
import {MVCContainer} from "../../../src/mvc/MVCContainer";
import {HttpHelper} from "../../helper/HttpHelper";
import {ServerHelper} from "../../helper/ServerHelper";


describe("Action integration", () => {

    @Controller("/2")
    class User2Controller {

        @Get("/users")
        public indexAction(@HeaderParam("Authorization") authorization: string) {
            return authorization;
        }

        @Get("/users/active")
        public activeAction(@QueryParam("status") status: string) {
            return status;
        }

        @Get("/users/:id")
        public showAction(@PathParam("id") id: number) {
            return id;
        }

        @Post("/users")
        public createAction(@BodyParam("id") id: number) {
            return id;
        }
    }


    const app = ServerHelper.simpleServer();
    let server;

    before(done => {
        const routes = MVCContainer.getRoutes();
        routes.forEach(item => app.use(item.baseRoute, item.router));
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


        return HttpHelper.sendRequest("get", "http://localhost:4444/2/users", options, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal(123);
        });
    });

    it("should get PathParam in the action", () => {
        return HttpHelper.sendRequest("get", "http://localhost:4444/2/users/1", options, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal(1);
        });
    });

    it('should get BodyParam in the action', () => {

        return HttpHelper.sendRequest("post", "http://localhost:4444/2/users", options, (response) => {
            response.statusCode.should.be.equal(201);
            response.body.should.be.equal(1);
        });
    });

    it('should get QueryParam in the action', () => {

        return HttpHelper.sendRequest("get", "http://localhost:4444/2/users/active", options, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal('abc');
        });
    });

});
