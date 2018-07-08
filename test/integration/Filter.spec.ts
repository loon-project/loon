import "../TestHelper";
import {RestController} from "../../src/mvc/decorator/Controller";
import {AfterFilter, BeforeFilter, Filter} from "../../src/mvc/decorator/Filter";
import {IMiddleware} from "../../src/mvc/interface/IMiddleware";
import {Data, Next, Res} from "../../src/mvc/decorator/Params";
import * as Express from "express";
import {Get} from "../../src/mvc/decorator/Method";
import {HttpHelper} from "../helper/HttpHelper";
import {expect} from 'chai';
import * as express from 'express'
import { ApplicationLoader } from '../../src'

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


describe("[Integration] Filter", () => {

    let nodeServer
    before(done => {
        (<Promise<express.Application>>new ApplicationLoader('express').init()).then((server) => {
            nodeServer = server.listen(0, done)
        })
    })
    after(done => nodeServer.close(done))


    it('should successfully use BeforeFilter', async () => {
        const response = await HttpHelper.request("get", `http://localhost:${nodeServer.address().port}/users`);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.equal('Jack');
    });

    it('should successfully use AfterFilter', async () => {
        const response = await HttpHelper.request("get", `http://localhost:${nodeServer.address().port}/users/1`);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.deep.equal({username: "Hill"});
    });

    it('should trigger Filter with action in the only FilterOptions', async () => {
        const response = await HttpHelper.request("get", `http://localhost:${nodeServer.address().port}/users1`);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.deep.equal({changed: true});
    });

    it('should not trigger Filter without action in the only FilterOptions', async () => {
        const response = await HttpHelper.request("get", `http://localhost:${nodeServer.address().port}/users2`);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.deep.equal({});
    });

    it('should not trigger Filter with action in the except FilterOptions', async () => {
        const response = await HttpHelper.request("get", `http://localhost:${nodeServer.address().port}/users1`);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.deep.equal({changed: true});
    });

    it('should trigger Filter without action in the except FilterOptions', async () => {
        const response = await HttpHelper.request("get", `http://localhost:${nodeServer.address().port}/users2`);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.deep.equal({});
    });
});