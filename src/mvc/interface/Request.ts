import * as Express from 'express';
import * as http from 'http'
import * as http2 from 'http2'

export interface Request<HttpRequest extends (http.IncomingMessage | http2.Http2ServerRequest) = http.IncomingMessage> {
  query: {
    [key: string]: any
  },

  params: {
    [key: string]: any
  },

  headers: {
    [key: string]: any
  },

  body: any,

  raw: HttpRequest,
  req: HttpRequest
}
