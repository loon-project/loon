import {HttpException} from "./HttpException";

export class NotFound extends HttpException {

    constructor(message?: string, code?: string) {
        super(404, code ? code : 'ERR_RESOURCE_NOT_FOUND', message ? message : 'resource not found');
    }
}