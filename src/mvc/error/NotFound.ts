import {HttpException} from "./HttpException";

export class NotFound extends HttpException {

    public status = 404;

    public code = "ERR_RESOURCE_NOT_FOUND";

    public message = 'resource not found';

}