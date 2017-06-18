import "../TestHelper";
import {BadRequest} from "../../src/mvc/error/BadRequest";
import {HttpException} from "../../src/mvc/error/HttpException";
import {InternalServerError} from "../../src/mvc/error/InternalServerError";
import {NotFound} from "../../src/mvc/error/NotFound";
import {Unauthorized} from "../../src/mvc/error/Unauthorized";
import {ParamRequired} from "../../src/mvc/error/ParamRequired";
import {expect} from 'chai';

describe('HttpException', () => {

    it('should successfully throw a BadRequest', () => {

        const badRequest = new BadRequest();

        expect(badRequest.status).to.be.equal(400);
        expect(badRequest.code).to.be.equal('ERR_BAD_REQUEST');
        expect(badRequest.message).to.be.equal('bad request');
        expect(badRequest).be.an.instanceof(HttpException);
    });

    it('should successfully throw a InternalServerError', () => {

        const serverError = new InternalServerError();

        expect(serverError.status).to.be.equal(500);
        expect(serverError.code).to.be.equal('ERR_INTERNAL_ERROR');
        expect(serverError.message).to.be.equal('internal error occurs');
        expect(serverError).to.be.an.instanceof(HttpException);
    });

    it('should successfully throw a NotFound', () => {

        const notFound = new NotFound();

        expect(notFound.status).to.be.equal(404);
        expect(notFound.code).to.be.equal('ERR_RESOURCE_NOT_FOUND');
        expect(notFound.message).to.be.equal('resource not found');
        expect(notFound).to.be.an.instanceof(HttpException);
    });

    it('should successfully throw a Unauthorized', () => {

        const unauthorized = new Unauthorized();

        expect(unauthorized.status).to.be.equal(401);
        expect(unauthorized.code).to.be.equal('ERR_UNAUTHORIZED');
        expect(unauthorized.message).to.be.equal('unauthorized');
        expect(unauthorized).to.be.an.instanceof(HttpException);
    });

    it('should successfully throw a ParamRequired', () => {

        const paramRequired = new ParamRequired("name");

        expect(paramRequired.status).to.be.equal(400);
        expect(paramRequired.code).to.be.equal('ERR_PARAM_ABSENCE');
        expect(paramRequired).to.be.an.instanceof(HttpException);
    });

});