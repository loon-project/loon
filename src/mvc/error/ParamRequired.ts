import {HttpException} from "./HttpException";

export class ParamRequired extends HttpException {

    constructor(message: string, code?: string) {
        super(400, code ? code : 'ERR_PARAM_ABSENCE', message);
    }
}