import {HttpException} from "./HttpException";

export class InternalServerError extends HttpException {

    public status = 500;

    public code = 'ERR_INTERNAL_ERROR';

    public message = 'internal error occurs';

}