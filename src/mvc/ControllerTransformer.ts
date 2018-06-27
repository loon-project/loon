import {ControllerMetadata} from "./ControllerMetadata";
import * as Express from "express";
import * as fastify from 'fastify'
import {HandlerTransformer} from "./HandlerTransformer";
import * as _ from "lodash";
import {RouterLogger} from "../util/RouterLogger";

export class ControllerTransformer {

    private _controllerMetadata: ControllerMetadata;

    private _router: fastify.FastifyInstance;

    get controllerMetadata(): ControllerMetadata {
        return this._controllerMetadata;
    }

    constructor(controllerMetadata: ControllerMetadata, fastify: fastify.FastifyInstance) {
        this._controllerMetadata = controllerMetadata;
        this._router = fastify;
    }

    public transform() {

        this._controllerMetadata.handlers.forEach(handlerMetadata => {
            const handlerTransformer = new HandlerTransformer(handlerMetadata);
            const handler = handlerTransformer.transformHandler();
            const [beforeFilters, afterFilters] = this.getFiltersForAction(handlerMetadata.actionName);

            handlerMetadata.httpMethodAndPaths.forEach(httpMethodAndPath => {

                RouterLogger.push([
                    httpMethodAndPath.method,
                    this._controllerMetadata.baseUrl,
                    httpMethodAndPath.path,
                    handlerMetadata.type.name,
                    handlerMetadata.actionName
                ]);

                this._router.register((fastify, opts, next) => {

                    beforeFilters.forEach(filter => {
                        fastify.addHook('preHandler', filter)
                    })

                    afterFilters.forEach(filter => {
                        fastify.addHook('onSend', filter)
                    })


                    fastify[httpMethodAndPath.method](httpMethodAndPath.path, handler)
                    next()
                })
            });
        });

        return this._router;
    }

    private getFiltersForAction(actionName: string) {


        return ['beforeFilters', 'afterFilters'].map(key => {
            const store: any[] = [];

            this._controllerMetadata[key].forEach(controllerFilterMetadata => {

                let flag = true;

                // filter have only option, this action don't include inside it
                if (controllerFilterMetadata.only && controllerFilterMetadata.only.indexOf(actionName) === -1) {
                    flag = false;
                }

                // filter have except option, this action include inside it
                if (controllerFilterMetadata.except && controllerFilterMetadata.except.indexOf(actionName) > -1) {
                    flag = false;
                }

                if (flag) {
                    const handlerMetadata = controllerFilterMetadata.filterMetadata.handler;
                    const handlerTransformer = new HandlerTransformer(handlerMetadata);
                    store.push(handlerTransformer.transform());
                }

                return store;
            });

            return store;
        });
    }
}