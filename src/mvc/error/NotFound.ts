import {HttpException} from "./HttpException";

export class NotFound extends HttpException {

    public code = 404;

    public message = 'NOT_FOUND';

}