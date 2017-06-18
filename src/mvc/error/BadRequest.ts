import {HttpException} from "./HttpException";

export class BadRequest extends HttpException {

    constructor(message?: string, code?: string) {
        super(400, code ? code : 'ERR_BAD_REQUEST', message ? message : 'bad request');
    }
}