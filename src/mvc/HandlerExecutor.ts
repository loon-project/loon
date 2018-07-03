import * as _ from "lodash"
import { HandlerMetadata } from "./HandlerMetadata";
import {DependencyRegistry} from "../di/DependencyRegistry";
import {ConverterService} from "../converter/ConverterService";
import {ParamType} from "./enum/ParamType";
import {IHandlerAdapter} from '../server-adapters/IAdapter'
import {Klass} from "../core/Klass";

/**
 *  There are two kinds of Handler in LOON, one is (req, res, next) => {}, another one is (err, req, res, next) => {}
 *    Given a HandlerMetadata,    
 *     
 */
export class HandlerExecutor {

  static run(adapter: IHandlerAdapter, handlerMetadata: HandlerMetadata, req: any, res, next?, err?: Error) {
    const methodName = handlerMetadata.actionName;
    const args: any[] = [];
    const converter = DependencyRegistry.get(ConverterService);
    const request = adapter.request(req)

    handlerMetadata.params.forEach(param => {
        switch (param.paramType) {
            case ParamType.Path:
                let path = _.get(request.params, param.expression);
                path = converter.convert(path, param.returnType);
                args.push(path);
                return;
            case ParamType.Body:
                let body = _.get(request.body, param.expression);
                body = converter.convert(body, param.returnType);
                args.push(body);
                return;
            case ParamType.Query:
                let query = _.get(request.query, param.expression);
                query = converter.convert(query, param.returnType);
                args.push(query);
                return;
            case ParamType.Header:
                const header = request.headers[param.expression];
                args.push(header);
                return;
            case ParamType.Error:
                args.push(err);
                return;
            case ParamType.Request:
                args.push(request);
                return;
            case ParamType.Response:
                args.push(res);
                return;
            case ParamType.Next:
                args.push(next);
                return;
            default:
                args.push(undefined);
                return;
        }
    });


    const handlerKlass = <Klass>handlerMetadata.type;
    const handlerInstance = DependencyRegistry.get(handlerKlass);
    return handlerInstance[methodName].apply(handlerInstance, args);
  }
}