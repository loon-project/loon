import "../TestHelper";
import * as Express from "express";
import * as fastify from 'fastify'
import * as express from 'express'
import {Middleware, ErrorMiddleware} from "../../src/mvc/decorator/Middleware";
import {IMiddleware} from "../../src/mvc/interface/IMiddleware";
import {Res, Next, Data, Err, Req} from "../../src/mvc/decorator/Params";
import {RestController} from "../../src/mvc/decorator/Controller";
import {Get} from "../../src/mvc/decorator/Method";
import {HttpHelper} from "../helper/HttpHelper";
import {expect} from 'chai';
import { ApplicationLoader } from '../../src'

@Middleware()
class GlobalMiddleware implements IMiddleware {

    public use(@Res() res: express.Response, @Next() next: Express.NextFunction) {
        res.locals.global = 'global'
        next();
    }
}

@Middleware({baseUrl: "/user"})
class GlobalPartialMiddleware implements IMiddleware {

    public use(@Res() res: express.Response, @Next() next: Express.NextFunction) {
        res.locals.partial = 'partial';
        next();
    }
}

@ErrorMiddleware()
class GlobalErrorMiddleware implements IMiddleware {
    public use(@Err() err: any, @Res() res: Express.Response) {
        res.send(err.message);
    }
}

@RestController()
class UserController {

    @Get("/")
    public indexAction(@Res() res: Express.Response) {
        res.send(res.locals.global);
    }

    @Get("/users")
    public indexUsersAction(@Next() next: Express.NextFunction) {
        try {
            throw new Error("no user found");
        } catch (e) {
            next(e);
        }
    }

    @Get("/user/1")
    public showAction(@Res() res: Express.Response) {
        res.send(res.locals.partial);
    }
}



describe("[Integration] Middleware", () => {

    let nodeServer
    before(done => {
        (<Promise<express.Application>>new ApplicationLoader('express').init()).then((server) => {
            nodeServer = server.listen(0, done)
        })
    })
    after(done => nodeServer.close(done))

    it("should use global middleware", async () => {
        const response = await HttpHelper.request("get", `http://localhost:${nodeServer.address().port}`);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.equal('global');
    });

    it('should use global error middleware', async () => {
        const response = await HttpHelper.request("get", `http://localhost:${nodeServer.address().port}/users`);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.equal('no user found');
    });

    it('should use baseUrl option for middleware', async () => {
        const response = await HttpHelper.request("get", `http://localhost:${nodeServer.address().port}/user/1`);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.equal("partial");
    });
});