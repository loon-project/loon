import {HttpException} from "./HttpException";

export class Unauthorized extends HttpException {

    public status = 401;

    public code = 'ERR_UNAUTHORIZED';

    public message = 'unauthorized';
}