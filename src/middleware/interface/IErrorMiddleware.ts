import * as Express from 'express';

export interface IErrorMiddleware {

    use(error: Error, request: Express.Request, response: Express.Response, next: Express.NextFunction): any;

}

