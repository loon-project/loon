import {TypedContext} from "./TypedContext";
import {ServerContainer} from "./ServerContainer";
import {TypedServer} from "./TypedServer";
import {TypedApplicationOption} from "./TypedApplicationOption";
import * as Express from "express";
import {LogFactory} from "../logger/LogFactory";
import {ConnectionFactory} from "../data/ConnectionFactory";


export class TypedApplication {

    // private middlewares: ((req, res, next) => any)[];
    // private initializers: (() => any)[];
    //
    // public server: Express.Application;
    //
    // constructor(options: TypedApplicationOption) {
    //     this.middlewares = [];
    //     this.initializers = [];
    //     this.server = Express();
    //     TypedPath.init(options);
    // }
    //
    // public use(middleware: (req, res, next) => any) {
    //     this.middlewares.push(middleware);
    // }
    //
    // public initialize(initializer: () => any) {
    //     this.initializers.push(initializer);
    // }
    //
    // public start() {
    //     this.initialize(LogFactory.init);
    //     this.initialize(ConnectionFactory.init);
    //     this.initializers.map(plugin => plugin());
    //
    // }

    // private static middlewares: ((req, res, next) => any)[] = [];
    //
    // public static use(middleware: (req, res, next) => any) {
    //     this.middlewares.push(middleware);
    // }
    //
    // public static run() {
    //     TypedContext.init(ServerContainer.options);
    //     const server = new TypedServer();
    //     this.middlewares.map(server.use.bind(server));
    //     server.start();
    // }

}

