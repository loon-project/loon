import {HttpException} from "./HttpException";

export class Unauthorized extends HttpException {

    public code = 401;

    public message = 'UNAUTHORIZED';
}