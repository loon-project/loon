import {HttpException} from "./HttpException";

export class Unauthorized extends HttpException {

    constructor(message?: string, code?: string) {
        super(401, code ? code : 'ERR_UNAUTHORIZED', message ? message : 'unauthorized');
    }
}