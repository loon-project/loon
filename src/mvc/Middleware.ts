
export interface Middleware {

    use?(context: any, next: (err?: any) => Promise<any>): Promise<any>;

}