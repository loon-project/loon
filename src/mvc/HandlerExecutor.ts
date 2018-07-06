import { HandlerMetadata } from "./HandlerMetadata";
import { DependencyRegistry } from "../di/DependencyRegistry";
import { ParamType } from "./enum/ParamType";
import { IHandlerAdapter } from '../server-adapters/IAdapter'
import { Klass } from "../core/Klass";

export interface ServerHandlerOptions {
    req: any
    res: any
    next?: (err?: Error) => any
    err?: Error
}

/**
 * Genaric way to execute handler with adapter and handler metadata
 */
export class HandlerExecutor {

  static run(adapter: IHandlerAdapter, handlerMetadata: HandlerMetadata, opts: ServerHandlerOptions) {
    const args: any[] = [];
    const req = opts.req
    const res = opts.res

    handlerMetadata.params.forEach(param => {
        switch (param.paramType) {
            case ParamType.Path:
                args.push(adapter.getPathFromRequest(req, param))
                break
            case ParamType.Body:
                args.push(adapter.getBodyFromRequest(req, param))
                break
            case ParamType.Query:
                args.push(adapter.getQueryFromRequest(req, param))
                break
            case ParamType.Header:
                args.push(adapter.getHeaderFromRequest(req, param))
                break
           case ParamType.Request:
                // pass raw request from server (fastify or express maybe other server later on)
                args.push(req);
                break
            case ParamType.Response:
                args.push(res);
                break
            case ParamType.Error:
                args.push(opts.err);
                break
            case ParamType.Next:
                args.push(opts.next);
                break
            default:
                args.push(undefined);
        }
    })


    const methodName = handlerMetadata.actionName;
    const handlerKlass = <Klass>handlerMetadata.type;
    const handlerInstance = DependencyRegistry.get(handlerKlass);
    return handlerInstance[methodName].apply(handlerInstance, args);
  }
}