import * as Express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import {MVCContainer} from "../mvc/MVCContainer";

export abstract class TypedApplication {

    public server: Express.Application;

    constructor() {
        this
            .$onInitServer()
            .$onInitMiddlewares()
            .$onInitRoutes()
            .$onReady();
    }

    protected $onInitServer() {
        this.server = Express();
        return this;
    }

    protected $onInitMiddlewares() {
        this.server.use(bodyParser.json());
        this.server.use(bodyParser.urlencoded({ extended: true }));
        this.server.use(cookieParser());
        return this;
    }

    protected $onInitRoutes() {
        MVCContainer
            .getRoutes()
            .map(item => this.server.use(item.baseRoute, item.router));

        return this;
    }

    protected $onReady() {
        return this;
    }

    protected $onError() {
    }

    public start() {
        this.server.listen(8080, () => {
            console.log("TypedApplication listen on port 8080");
        });
    }
}