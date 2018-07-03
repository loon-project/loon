import {HandlerMetadata} from "./HandlerMetadata";
import * as Express from "express";
import {ParamType} from "./enum/ParamType";
import {Klass} from "../core/Klass";
import {DependencyRegistry} from "../di/DependencyRegistry";
import * as _ from "lodash";
import {ParamRequired} from "./error/ParamRequired";
import {ConverterService} from "../converter/ConverterService";
import {NextFunction} from "./interface/NextFunction";
import {Request} from './interface/Request';
import {Response} from './interface/Response';

function noop() {}

/**
 * Transform a handler to a express handler
 *
 * Support required param check, and param convert for PathParam, BodyParam, QueryParam
 *
 */
export class HandlerTransformer {

    private _handlerMetadata: HandlerMetadata;

    get handlerMetadata(): HandlerMetadata {
        return this._handlerMetadata;
    }

    constructor(handlerMetadata: HandlerMetadata) {
        this._handlerMetadata = handlerMetadata;
    }

    public transform() {
        const isErrorHandler = this.handlerMetadata.isErrorHandler;
        if (isErrorHandler) return this.transformErrorHandler()
        return this.transformHandler()
    }

    public transformHandler(): (req, res) => any {
        return (req, res) => {
            return new Promise((resolve, reject) => {
                try {
                    this.invokeMethod(req, res, noop)
                    resolve()
                } catch (e) {
                    reject(e)
                }
            })
        }
    }

    public transformErrorHandler(): (err, req, res) => any {
        return (err, req, res) => {
            return Promise
                .resolve()
                .then(() => this.invokeMethod(req, res, noop, err))
        };
    }
}