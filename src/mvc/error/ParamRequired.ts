import {HttpException} from "./HttpException";

export class ParamRequired extends HttpException {

    public status = 400;

    public code = 'ERR_PARAM_ABSENCE';

    public message: string;

    constructor(field: string) {

        super();

        this.message = `parameter ${field} is absence`;
    }
}