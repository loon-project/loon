import "../TestHelper";
import {RestController} from "../../src/mvc/decorator/Controller";
import {Get} from "../../src/mvc/decorator/Method";
import {
    BodyParam, CookieParam, PathParam, QueryParam, HeaderParam, Request,
    Response, Next
} from "../../src/mvc/decorator/Params";
import * as Express from 'express';
import {ControllerRegistry} from "../../src/mvc/ControllerRegistry";
import {HandlerTransformer} from "../../src/mvc/HandlerTransformer";

describe('HandlerTransformer', () => {

    @RestController()
    class ATestRestControllerClass {

        @Get("/")
        public indexAction(@BodyParam("body") body: string,
                           @CookieParam("user_id") userId: number,
                           @PathParam("path_id") pathId: number,
                           @QueryParam("q") q: any,
                           @HeaderParam("Authorization") authorization: string,
                           @Request() request: Express.Request,
                           @Response() response: Express.Response,
                           @Next() next: Express.NextFunction) {

            return {
                text: "Hello world"
            };
        }
    }

    it('should convert to router handler', () => {

        const controllerMetadata: any = ControllerRegistry.controllers.get(ATestRestControllerClass);
        controllerMetadata.should.not.be.undefined;

        const handlerMetadata: any = controllerMetadata.handlers.get('indexAction');
        handlerMetadata.should.not.be.undefined;
        handlerMetadata.params.size.should.be.equal(8);
        handlerMetadata.actionName.should.be.equal('indexAction');

        const transformer = new HandlerTransformer(handlerMetadata);
        (typeof transformer.transform()).should.be.equal('function');
    });
});