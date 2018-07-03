import * as express from 'express'
import {IHandlerAdapter} from "./IAdapter";
import {HandlerMetadata} from "../mvc/HandlerMetadata";

export class ExpressHandlerAdapter implements IHandlerAdapter {

  private _handlerMetadata: HandlerMetadata

  constructor(handlerMetadata: HandlerMetadata) {
    this._handlerMetadata = handlerMetadata
  }

  request(req: express.Request) {
    return {
      params: req.params,
      query: req.query,
      headers: req.headers,
      body: req.body
    }
  }
}