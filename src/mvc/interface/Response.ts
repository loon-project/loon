import * as Express from "express";

export interface Response extends Express.Response {
    _data: any;
}
