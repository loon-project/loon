import {HttpException} from "./HttpException";

export class BadRequest extends HttpException {

    public status = 400;

    public code = 'ERR_BAD_REQUEST';

    public message = 'bad request';
}