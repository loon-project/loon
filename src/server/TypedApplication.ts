import * as Express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as methodOverride from "method-override";
import {MVCContainer} from "../mvc/MVCContainer";
import {Log} from "../logger/index";
import {TypedContext} from "./TypedContext";

export abstract class TypedApplication {

    public server: Express.Application;

    protected port: number = 8080;

    constructor(srcDir: string, configDir: string) {

        console.log("[TYPED] => booting application");

        TypedContext.init(srcDir, configDir);

        this
            .$onInitServer()
            .$onInitMiddlewares()
            .$onInitRoutes();
    }

    protected $onInitServer() {

        this.server = Express();

        return this;
    }

    protected $onInitMiddlewares() {

        this.use(bodyParser.json());
        this.use(bodyParser.urlencoded({ extended: true }));
        this.use(cookieParser());
        this.use(methodOverride('X-HTTP-Method'));
        this.use(methodOverride('X-HTTP-Method-Override'));
        this.use(methodOverride('X-Method-Override'));

        return this;
    }

    protected $onInitRoutes() {
        MVCContainer
            .getRoutes()
            .map(item => this.server.use(item.baseRoute, item.router));

        return this;
    }

    protected $onError() {
    }


    public use(middleware: any) {

        this.server.use(middleware);
        return this;
    }

    public start() {

        this.server.listen(this.port, () => {
            Log.logger.info(`Application is listening on port ${this.port}`);
        });
    }
}