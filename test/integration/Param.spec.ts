import "../TestHelper";
import * as Express from 'express';
import {RestController} from "../../src/mvc/decorator/Controller";
import {Get, Post, Patch} from "../../src/mvc/decorator/Method";
import {HeaderParam, Res, QueryParam, PathParam, BodyParam} from "../../src/mvc/decorator/Params";
import {HttpHelper} from "../helper/HttpHelper";
import * as express from 'express'
import {HttpException} from "../../src/mvc/error/HttpException";
import {expect} from 'chai';
import { ApplicationLoader } from '../../src'

@RestController()
class UserController {

    @Get("/users")
    public indexAction(@HeaderParam("authorization") authorization: string,
                        @Res() res: Express.Response) {
        res.send(authorization);
    }

    @Get("/users/active")
    public activeAction(@QueryParam("status") status: string,
                        @Res() res: Express.Response) {
        res.send(status);
    }

    @Get("/users/:id")
    public showAction(@PathParam("id") id: string,
                      @Res() res: Express.Response) {
        res.send(id);
    }

    @Post("/users")
    public createAction(@BodyParam("id") id: number,
                        @Res() res: Express.Response) {
        res.status(201).send(`${id}`);
    }

    @Patch("/users/:id")
    public updateAction(@PathParam("id") id: string,
                        @BodyParam("user") user: any,
                        @Res() res: Express.Response) {
        if (id === "1") {
            res.send(user.name);
        }
    }
}

describe("[Integration] Param", () => {

    let nodeServer
    before(done => {
        (<Promise<express.Application>>new ApplicationLoader('express').init()).then((server) => {
            nodeServer = server.listen(0, done)
        })
    })
    after(done => nodeServer.close(done))

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

    it('should get HeaderParam in the action', async () => {
        const response = await HttpHelper.request("get", `http://localhost:${nodeServer.address().port}/users`, options);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.equal(123);
    });

    it("should get PathParam in the action", async () => {
        const response = await HttpHelper.request("get", `http://localhost:${nodeServer.address().port}/users/1`, options);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.equal(1);
    });

    it('should get BodyParam in the action', async () => {
        const response = await HttpHelper.request("post", `http://localhost:${nodeServer.address().port}/users`, options);
        expect(response.statusCode).to.be.equal(201);
        expect(response.body).to.be.equal(1);
    });

    it('should get QueryParam in the action', async () => {
        const response = await HttpHelper.request("get", `http://localhost:${nodeServer.address().port}/users/active`, options);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.equal('abc');
    });

    it('should get complex object in the action', async () => {
        const options = {body: {user: {name: 'tester'}}};
        const response = await HttpHelper.request("patch", `http://localhost:${nodeServer.address().port}/users/1`, options);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body).to.be.equal('tester');
    });
});
