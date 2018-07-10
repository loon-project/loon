import * as fastify from 'fastify'
import * as http from 'http'
import * as http2 from 'http2'
import * as _ from 'lodash'
import { HandlerExecutor } from '../mvc/HandlerExecutor'
import { IHandlerAdapter, ILoaderAdapter } from './IAdapter'
import { ConverterService } from "../converter/ConverterService";
import { HandlerParamMetadata } from '../mvc/HandlerParamMetadata';
import { MiddlewareRegistry } from "../mvc/MiddlewareRegistry";
import { ControllerRegistry } from '../mvc/ControllerRegistry'

export type FastifyRequest = fastify.FastifyRequest<http.IncomingMessage | http2.Http2ServerRequest>

export class FastifyHandlerAdapter implements IHandlerAdapter {

  private _converter: ConverterService

  constructor(converter: ConverterService) {
    this._converter = converter
  }

  getPathFromRequest(req: FastifyRequest, param: HandlerParamMetadata) {
    const path = _.get(req.params, param.expression)
    return this._converter.convert(path, param.returnType)
  }

  getBodyFromRequest(req: FastifyRequest, param: HandlerParamMetadata) {
    const body = _.get(req.body, param.expression)
    return this._converter.convert(body, param.returnType)
  }

  getQueryFromRequest(req: FastifyRequest, param: HandlerParamMetadata) {
    const query = _.get(req.query, param.expression)
    return this._converter.convert(query, param.returnType)
  }

  getHeaderFromRequest(req: FastifyRequest, param: HandlerParamMetadata) {
    const header = _.get(req.headers, param.expression) 
    // header value should always be string, ignore the converter here
    return header
  }
}


export class FastifyLoaderAdapter implements ILoaderAdapter {

  private _server: fastify.FastifyInstance
  private _adapter: IHandlerAdapter

  constructor(server: fastify.FastifyInstance, adapter: IHandlerAdapter) {
    this._server = server
    this._adapter = adapter
  }
  
  loadMiddlewares() {
    MiddlewareRegistry
      .getMiddlewares({isErrorMiddleware: false})
      .forEach(middlewareMetadata => {
        const handlerMetadata = middlewareMetadata.handler;
        const middleware = (req, res, next) => {
          HandlerExecutor.run(this._adapter, handlerMetadata, {req, res, next})
        }
        this._server.use(middleware)
      })
  }

  loadControllers() {

    ControllerRegistry.controllers.forEach(controllerMetadata => {
      // register a controller as a fastify plugin
      this._server.register((instance, opts, next) => {
        controllerMetadata.handlers.forEach(handlerMetadata => {

          function registerFilter(filterName, hookName) {
            const actionName = handlerMetadata.actionName
            controllerMetadata[filterName].forEach(controllerFilterMetadata => {
              if (
                (controllerFilterMetadata.only && controllerFilterMetadata.only.indexOf(actionName) === -1) || 
                (controllerFilterMetadata.except && controllerFilterMetadata.except.indexOf(actionName) > -1) ||
                controllerFilterMetadata
              ) {
                instance.addHook(hookName, (req, res, next) => {
                  HandlerExecutor.run(this._adapter, controllerFilterMetadata.filterMetadata.handler, {req, res})
                  next()
                })
              }
            })
          }

          // register before filter and after filter
          registerFilter('beforeFilters', 'preHandler')
          registerFilter('afterFilters', 'onSend')


          // register controller action
          handlerMetadata.httpMethodAndPaths.forEach(httpMethodAndPath => {
            instance[httpMethodAndPath.method](httpMethodAndPath.path, (req, res) => {
              HandlerExecutor.run(this._adapter, handlerMetadata, {req, res})
            })
          })

        })

        next()

      }, {prefix: controllerMetadata.baseUrl})

    })
  }

  // don't support baseUrl options
  loadErrorMiddlewares() {
    MiddlewareRegistry
      .getMiddlewares({isErrorMiddleware: true})
      .forEach(middlewareMetadata => {
        const handlerMetadata = middlewareMetadata.handler;
        const errorHandler = (err, req, res) => {
          HandlerExecutor.run(this._adapter, handlerMetadata, {req, res, err})
        }
        this._server.setErrorHandler(errorHandler)
      })
  }
}
