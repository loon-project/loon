import "../TestHelper";
import {BadRequest} from "../../src/mvc/error/BadRequest";
import {HttpException} from "../../src/mvc/error/HttpException";
import {InternalServerError} from "../../src/mvc/error/InternalServerError";
import {NotFound} from "../../src/mvc/error/NotFound";
import {Unauthorized} from "../../src/mvc/error/Unauthorized";

describe('HttpException', () => {

    it('should successfully throw a BadRequest', () => {

        const badRequest = new BadRequest();

        badRequest.message.should.be.equal('BAD_REQUEST');
        badRequest.code.should.be.equal(400);
        badRequest.should.be.an.instanceof(HttpException);
    });

    it('should successfully throw a InternalServerError', () => {

        const serverError = new InternalServerError();

        serverError.message.should.be.equal('INTERNAL_SERVER_ERROR');
        serverError.code.should.be.equal(500);
        serverError.should.be.an.instanceof(HttpException);
    });

    it('should successfully throw a NotFound', () => {

        const notFound = new NotFound();

        notFound.message.should.be.equal('NOT_FOUND');
        notFound.code.should.be.equal(404);
        notFound.should.be.an.instanceof(HttpException);
    });

    it('should successfully throw a Unauthorized', () => {

        const unauthorized = new Unauthorized();

        unauthorized.message.should.be.equal('UNAUTHORIZED');
        unauthorized.code.should.be.equal(401);
        unauthorized.should.be.an.instanceof(HttpException);
    });

});