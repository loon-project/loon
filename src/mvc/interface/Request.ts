import * as Express from 'express';

export interface Request extends Express.Request {
  id: string;
}
