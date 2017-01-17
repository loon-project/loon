import * as Router from "koa-router";
import {Controller} from "./Controller";
import {Action} from "./Action";

export class HttpContainer {

    private static serverMiddlewares = [];
    private static controllerMiddlewares = [];
    private static actionMiddlewares = [];
    private static controllers: {baseRoute: string, type: Function}[] = [];
    private static actions: {httpMethod: string, route: string|RegExp, target: any, key: string}[] = [];


    public static registerServerMiddleware() {
    }

    public static registerControllerMiddleware() {
    }

    public static registerActionMiddleware() {
    }

    public static registerAction(httpMethod: string, route: string|RegExp, target: any, key: string) {
        this.actions.push({httpMethod, route, target, key});
    }

    public static registerController(baseRoute: string, type: Function) {
        this.controllers.push({baseRoute, type});
    }

    // public static getRoutes(): Router[] {
    //     return this.controllers.map(item => new Router({prefix: item.baseRoute}));
    // }
    //
    // public static getActions() {
    // }

}