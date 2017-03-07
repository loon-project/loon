import * as Express from 'express';

export interface IMiddleware {

    use(request: Express.Request, response: Express.Response, next: Express.NextFunction): any;

}
