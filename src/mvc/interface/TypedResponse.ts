import * as Express from 'express';

export interface TypedResponse extends Express.Response {

    data: any;
}