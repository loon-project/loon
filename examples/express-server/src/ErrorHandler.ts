import * as express from 'express'
import {ErrorMiddleware, IMiddleware, Err, Res} from '../../../src'

@ErrorMiddleware()
export class GlobalErrorHandler implements IMiddleware {
  public use(@Err() err: Error, @Res() res:  express.Response) {
    if (err.name === 'AuthenticationFailure') {
      console.log('auth error')
      return res.status(401).send('auth error')
      
    }
    return res.status(500).send('unkown error')
  }
}