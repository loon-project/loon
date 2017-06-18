import {HttpException} from "./HttpException";

export class InternalServerError extends HttpException {

    constructor(message?: string, code?: string) {
        super(500, code ? code : 'ERR_INTERNAL_ERROR', message ? message : 'internal error occurs');
    }
}