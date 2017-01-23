import * as Express from 'express';

export interface Middleware {

    use(request: Express.Request, response: Express.Response, next: Express.NextFunction): any;

}