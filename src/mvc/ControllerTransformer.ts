import {ControllerMetadata} from "./ControllerMetadata";
import * as Express from "express";
import {HandlerTransformer} from "./HandlerTransformer";
import {MiddlewareStore} from "./MiddlewareStore";
import * as _ from "lodash";

export class ControllerTransformer {

    private _controllerMetadata: ControllerMetadata;

    private _router: Express.Router;

    private _controllerBeforeActions: Express.RequestHandler[];

    private _controllerAfterActions: Express.RequestHandler[];

    get controllerMetadata(): ControllerMetadata {
        return this._controllerMetadata;
    }

    constructor(controllerMetadata: ControllerMetadata) {
        this._controllerMetadata = controllerMetadata;
        this._router = Express.Router();

        [this._controllerBeforeActions, this._controllerAfterActions] = this.getActionHooks(controllerMetadata);
    }

    public transform() {

        this._controllerMetadata.handlers.forEach(handlerMetadata => {

            const handlerTransformer = new HandlerTransformer(handlerMetadata);
            const handler = handlerTransformer.transform();

            const actions = _.concat([],
                this._controllerBeforeActions,
                <any>handler,
                this._controllerAfterActions);

            handlerMetadata.httpMethodAndPaths.forEach(httpMethodAndPath => {
                this._router[httpMethodAndPath.method](httpMethodAndPath.path, actions);
            });
        });

        return this._router;
    }

    private getActionHooks(middlewareStore: MiddlewareStore) {
        return ['beforeActions', 'afterActions'].map(key => {
            const store: any[] = [];

            middlewareStore[key].forEach(middlewareMetadata => {
                const handlerMetadata = middlewareMetadata.handler;
                const handlerTransformer = new HandlerTransformer(handlerMetadata);
                store.push(handlerTransformer.transform());
            });

            return store;
        });
    }
}