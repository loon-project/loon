import * as Express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as methodOverride from "method-override";
import * as morgan from 'morgan';
import * as Path from 'path';
import {MVCContainer} from "../mvc/MVCContainer";
import {Log} from "../logger/index";
import {TypedContext} from "./TypedContext";
import {TypedApplicationOption} from "./TypedApplicationOption";
import {HttpException} from "../mvc/error/HttpException";

export abstract class TypedApplication {

    public server: Express.Application;

    protected port: number = 8080;

    constructor(rootDir: string, options: TypedApplicationOption) {

        console.log("[TYPED] => booting application");

        TypedContext.init(rootDir, options);

        this
            .$onInitServer()
            .$onInitMiddlewares()
            .$onInitViews()
            .$onInitRoutes()
            .$onError();
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
        this.use(morgan("combined", {
            stream: {
                write: message => Log.logger.info(message)
            }
        }));

        return this;
    }

    protected $onInitViews() {

        const viewFolder = Path.resolve(TypedContext.srcDir, 'views');

        const hbs = require('express-handlebars').create({
            defaultLayout: 'main',
            extname: '.hbs',
            layoutsDir: viewFolder + "/layouts",
            partialsDir: viewFolder + "/partials"
        });

        this.server.engine('.hbs', hbs.engine);
        this.server.set('view engine', '.hbs');
        this.server.set('views', viewFolder);

        return this;
    }

    protected $onInitRoutes() {
        MVCContainer
            .getRoutes()
            .map(item => this.server.use(item.baseRoute, item.router));

        return this;
    }

    protected $onError() {

        this.server.use((err, req: Express.Request, res: Express.Response) => {

            console.log(err);

            if (err instanceof HttpException) {
                res.status(err.code).send(err.message);
            }

        });
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