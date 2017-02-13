import * as Express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as methodOverride from "method-override";
import * as morgan from "morgan";
import {MVCContainer} from "../mvc/MVCContainer";
import {Log} from "../logger/index";
import {TypedContext} from "./TypedContext";
import {HttpException} from "../mvc/error/HttpException";

export class TypedServer {

    public server: Express.Application;

    private name: string;

    protected port: number = 8080;

    constructor(rootDir: string) {

        TypedContext.init({rootDir});

        this.name = this.constructor.name;

        this
            .$onInitServer()
            .$onInitMiddlewares()
            .$onInitViews()
            .$onInitRoutes()
            .$onInitWebpack()
            .$onError();

    }

    protected $onInitServer() {

        this.server = Express();

        return this;
    }

    protected $onInitMiddlewares() {

        this.use(morgan("combined", {
            stream: {
                write: message => Log.logger.info(message)
            }
        }));

        this.use(bodyParser.json());
        this.use(bodyParser.urlencoded({ extended: true }));
        this.use(cookieParser());
        this.use(methodOverride('X-HTTP-Method-Override'));

        return this;
    }

    protected $onInitViews() {

        const hbs = require('express-handlebars').create({
            defaultLayout: 'main',
            extname: '.hbs',
            layoutsDir: TypedContext.viewDir + "/layouts",
            partialsDir: TypedContext.viewDir + "/partials"
        });

        this.server.engine('.hbs', hbs.engine);
        this.server.set('view engine', '.hbs');
        this.server.set('views', TypedContext.viewDir);

        return this;
    }

    protected $onInitWebpack() {

        // try {
        //
        //     if (!TypedContext.isProduction()) {
        //         const webpacker = new Webpacker();
        //         const compiler = webpack(webpacker.webpackConfig());
        //
        //         this.server.use(webpackDevMiddleware(compiler, {
        //             publicPath: '/assets/'
        //         }));
        //
        //     }
        //
        // } catch (e) {
        //     console.log(e.message);
        // }


        return this;
    }

    protected $onInitRoutes() {
        MVCContainer
            .getRoutes()
            .map(item => this.server.use(item.baseRoute, item.router));

        return this;
    }

    protected $onError() {

        this.server.use((err, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {

            if (res.headersSent) {
                next(err);
            } else if (err instanceof HttpException) {
                res.status(err.code).send(err.message);
            } else {
                next(err);
            }

            return;

        });
    }


    public use(middleware: any) {

        this.server.use(middleware);
        return this;
    }

    public start() {

        this.server.listen(this.port, () => {
            Log.logger.info(`${this.name} is listening on port ${this.port}`);
        });
    }
}
