import { HandlerParamMetadata } from '../mvc/HandlerParamMetadata'

export interface IHandlerAdapter {

  getPathFromRequest(req: any, param: HandlerParamMetadata): any

  getBodyFromRequest(req: any, param: HandlerParamMetadata): any

  getQueryFromRequest(req: any, param: HandlerParamMetadata): any

  getHeaderFromRequest(req: any, param: HandlerParamMetadata): any

}

export interface ILoaderAdapter {

  loadMiddlewares()

  loadControllers()

  loadErrorMiddlewares()

}