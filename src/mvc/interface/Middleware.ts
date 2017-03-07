import * as Express from 'express';

export interface Middleware {

    use(request: Express.Request, response: Express.Response, next: Express.NextFunction): any;

}


export interface IMiddleware {

    use(request: Express.Request, response: Express.Response, next: Express.NextFunction): any;
}

export interface IErrorMiddleware {

    use(error: Error, request: Express.Request, response: Express.Response, next: Express.NextFunction): any;
}

