import * as Router from "koa-router";
import {Action} from "./Action";
import {IMiddleware} from "./interface/IMiddleware";

export class Controller {

    private route: Router;
    private actions: Action[] = [];
    private controllerActions: IMiddleware[] = [];
    private beforeActions: IMiddleware[] = [];
    private afterActions: IMiddleware[] = [];


    constructor(baseUrl?: string) {
        this.route = new Router();
        this.route.prefix = baseUrl ? baseUrl : "";
    }

    public actionsToRoute() {
    }
}