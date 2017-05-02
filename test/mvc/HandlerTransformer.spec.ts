import "../TestHelper";
import {RestController} from "../../src/mvc/decorator/Controller";
import {Get} from "../../src/mvc/decorator/Method";
import {
    BodyParam, CookieParam, PathParam, QueryParam, HeaderParam, Req,
    Res, Next
} from "../../src/mvc/decorator/Params";
import * as Express from 'express';
import {ControllerRegistry} from "../../src/mvc/ControllerRegistry";
import {HandlerTransformer} from "../../src/mvc/HandlerTransformer";
import {expect} from 'chai';

describe('HandlerTransformer', () => {

    @RestController()
    class ATestRestControllerClass {

        @Get("/")
        public indexAction(@BodyParam("body") body: string,
                           @CookieParam("user_id") userId: number,
                           @PathParam("path_id") pathId: number,
                           @QueryParam("q") q: any,
                           @HeaderParam("Authorization") authorization: string,
                           @Req() request: Express.Request,
                           @Res() response: Express.Response,
                           @Next() next: Express.NextFunction) {

            return {
                text: "Hello world"
            };
        }
    }

    it('should convert to router handler', () => {

        const controllerMetadata: any = ControllerRegistry.controllers.get(ATestRestControllerClass);
        const handlerMetadata: any = controllerMetadata.handlers.get('indexAction');

        expect(handlerMetadata.params.size).to.be.equal(8);
        expect(handlerMetadata.actionName).to.be.equal('indexAction');

        const transformer = new HandlerTransformer(handlerMetadata);

        expect(typeof transformer.transform()).to.be.equal('function');
    });
});