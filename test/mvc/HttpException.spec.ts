import "../TestHelper";
import {BadRequest} from "../../src/mvc/error/BadRequest";
import {HttpException} from "../../src/mvc/error/HttpException";
import {InternalServerError} from "../../src/mvc/error/InternalServerError";
import {NotFound} from "../../src/mvc/error/NotFound";
import {Unauthorized} from "../../src/mvc/error/Unauthorized";
import {ParamRequired} from "../../src/mvc/error/ParamRequired";

describe('HttpException', () => {

    it('should successfully throw a BadRequest', () => {

        const badRequest = new BadRequest();

        badRequest.status.should.be.equal(400);
        badRequest.code.should.be.equal('ERR_BAD_REQUEST');
        badRequest.message.should.be.equal('bad request');
        badRequest.should.be.an.instanceof(HttpException);
    });

    it('should successfully throw a InternalServerError', () => {

        const serverError = new InternalServerError();

        serverError.status.should.be.equal(500);
        serverError.code.should.be.equal('ERR_INTERNAL_ERROR');
        serverError.message.should.be.equal('internal error occurs');
        serverError.should.be.an.instanceof(HttpException);
    });

    it('should successfully throw a NotFound', () => {

        const notFound = new NotFound();

        notFound.status.should.be.equal(404);
        notFound.code.should.be.equal('ERR_RESOURCE_NOT_FOUND');
        notFound.message.should.be.equal('resource not found');
        notFound.should.be.an.instanceof(HttpException);
    });

    it('should successfully throw a Unauthorized', () => {

        const unauthorized = new Unauthorized();

        unauthorized.status.should.be.equal(401);
        unauthorized.code.should.be.equal('ERR_UNAUTHORIZED');
        unauthorized.message.should.be.equal('unauthorized');
        unauthorized.should.be.an.instanceof(HttpException);
    });

    it('should successfully throw a ParamRequired', () => {

        const paramRequired = new ParamRequired("name");

        paramRequired.status.should.be.equal(400);
        paramRequired.code.should.be.equal('ERR_PARAM_ABSENCE');
        paramRequired.message.should.be.equal('parameter name is absence');
        paramRequired.should.be.an.instanceof(HttpException);
    });

});