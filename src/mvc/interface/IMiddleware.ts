
export interface IMiddleware {

    use?(context: any, next: (err?: any) => Promise<any>): Promise<any>;

}