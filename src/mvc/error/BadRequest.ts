import {HttpException} from "./HttpException";

export class BadRequest extends HttpException {

    public code = 400;

    public message = 'BAD_REQUEST';
}