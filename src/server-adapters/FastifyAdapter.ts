import * as fastify from 'fastify'
import * as http from 'http'
import * as http2 from 'http2'
import { HandlerMetadata } from "../mvc/HandlerMetadata";
import {IHandlerAdapter, IServerAdapter, ILoaderAdapter} from './IAdapter'

type GenericHandler = (req, res, next) => void
type GenericErrorHandler = (err, req, res, next) => void

export class FastifyHandlerAdapter implements IHandlerAdapter {

  private _handlerMetadata: HandlerMetadata

  constructor(handlerMetadata: HandlerMetadata) {
    this._handlerMetadata = handlerMetadata
  }

  request(req: fastify.FastifyRequest<http.IncomingMessage | http2.Http2ServerRequest>) {
    return {
      params: req.params,
      query: req.query,
      headers: req.headers,
      body: req.body
    }
  }

  httpHandler() {
    return (request, reply) => {
    }
  }

  errorHTTPHandler() {
    return (r1, r2, r3, r4) => {

    }
    // return handler.bind(undefined, req, )
  }

  beforeFilterHandler(handler: GenericHandler) {
    return handler
  }

  afterFilterHandler(handler: (req, res, next) => any) {
    // return (req, req, payload, next) => {
    //   bodyk
    // }
  }

  middleware() {

  }

}


export class FastifyLoaderAdapter implements ILoaderAdapter {

}