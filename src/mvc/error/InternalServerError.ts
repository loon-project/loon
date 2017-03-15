import {HttpException} from "./HttpException";

export class InternalServerError extends HttpException {

    public code = 500;

    public message = 'INTERNAL_SERVER_ERROR';

}