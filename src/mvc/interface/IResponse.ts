import * as Express from "express";

export interface IResponse extends Express.Response {
    data: any;
}
