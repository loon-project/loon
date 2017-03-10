import {ApplicationRegistry} from "./ApplicationRegistry";
import * as Express from "express";
import {LogFactory} from "../logger/LogFactory";
import {ConnectionFactory} from "../data/ConnectionFactory";
import * as Fs from "fs";
import {ControllerRegistry} from "../mvc/ControllerRegistry";
import {HandlerTransformer} from "../mvc/HandlerTransformer";
import {ControllerTransformer} from "../mvc/ControllerTransformer";


export class ApplicationLoader {

    private _server: Express.Application;

    private _env: string;

    private _rootDir: string;

    private _srcDir: string;

    private _publicDir: string;

    private _logDir: string;

    private _configDir: string;

    private _dbDir: string;

    private _port: number;

    // TODO: add routes group support
    private _routes: {[key: string]: string};

    // TODO: add external components support
    private _components: string[];


    get server() {
        return this._server;
    }

    get env(): string {
        return this._env;
    }

    get components(): string[] {
        return this._components;
    }

    get routes(): any {
        return this._routes;
    }

    get rootDir(): string {
        return this._rootDir;
    }

    get srcDir(): string {
        return this._srcDir;
    }

    get publicDir(): string {
        return this._publicDir;
    }

    get logDir(): string {
        return this._logDir;
    }

    get configDir(): string {
        return this._configDir;
    }

    get dbDir(): string {
        return this._dbDir;
    }

    get port(): number {
        return this._port;
    }

    /**
     * Load user defined settings into ApplicationLoader
     * Initialize settings
     */
    constructor() {

        this._server = Express();
        const settings = ApplicationRegistry.settings;

        this._env = process.env.NODE_ENV || settings.env || 'development';

        this._rootDir = settings.rootDir;

        // Assign user defined folder structure to ApplicationLoader
        // If no such folder, then create it
        ['src', 'public', 'log', 'config', 'db'].map(item => {
            this[`_${item}Dir`] = settings[`${item}Dir`] || `${this._rootDir}/${item}`;

            if (!Fs.existsSync(this[`_${item}Dir`]) && this._env !== 'test') {
                Fs.mkdirSync(this[`_${item}Dir`]);
            }
        });


        this._port = process.env.PORT || settings.port || 9000;

        this._components = settings.components || [];
        this._routes = settings.routes || {};
    }

    public start(): Promise<any> {

        return Promise
            .resolve()
            .then(() => this.init())
            .then(() => this.load())
            .then(() => this.run());
    }


    /**
     *
     * Initialize all settings
     * If exception occurs when initialization, throw the error and stop the application
     * Run $onInit hooks if user defined
     *
     * @returns {Promise<any>}
     */
    private init() {

        return Promise
            .resolve()
            .then(() => {

                LogFactory.init(this.logDir, this.env);

                ConnectionFactory.init(this.configDir, this.env);

            })
            .then(() => {

                '$onInit' in this ? (<any> this).$onInit() : null;

            })
            .then(() => {

                const logger = LogFactory.getLogger();

                this.server.use(require('morgan')("combined", {
                    stream: {
                        write: message => logger.info(message)
                    }
                }));

                this.server.use(require('body-parser').json());
                this.server.use(require('body-parser').urlencoded({ extended: true }));
                this.server.use(require('cookie-parser')());
                this.server.use(require('method-override')());
                this.server.use(require('serve-static')(this.publicDir));

            })
            .then(() => {

                require('require-all')({
                    dirname     :  this.srcDir,
                    excludeDirs :  new RegExp(`^\.(git|svn|node_modules|${this.configDir}|${this.logDir}})$`),
                    recursive   : true
                });

            })
            .catch((e) => {
                throw e;
            });

    }

    /**
     *
     * Load all the user defined middlewares
     * Load all the user defined routes
     * Load all the user defined error handlers
     *
     * @returns {Promise<any>}
     */
    private load(): Promise<any> {

        return Promise
            .resolve()
            .then(() => this.loadMiddlewares())
            .then(() => this.loadRoutes())
            .then(() => this.loadErrorMiddlewares());

    }

    /**
     *
     * After initialization and load all middlewares and routes and error handlers
     * Start run the server to serve all http requests
     *
     * @returns {Promise<any>}
     */
    private run(): Promise<any> {
        return Promise
            .resolve()
            .then(() => {
                this.server.listen(this.port, () => {
                    const logger = LogFactory.getLogger();
                    logger.info(`Application is listening on port ${this.port}`);
                });
            })
            .catch((e) => {
                throw e;
            });
    }

    private loadMiddlewares() {
        ControllerRegistry.middlewares.forEach(middlewareMetadata => {
            if (middlewareMetadata.isGlobalMiddleware) {
                const handlerMetadata = middlewareMetadata.handler;
                const transformer = new HandlerTransformer(handlerMetadata);
                this._server.use(transformer.transform());
            }
        });
    }

    private loadRoutes() {

        ControllerRegistry.controllers.forEach(controllerMetadata => {
            const transformer = new ControllerTransformer(controllerMetadata);
            const router = transformer.transform();
            this._server.use(controllerMetadata.baseUrl, router);
        });
    }

    private loadErrorMiddlewares() {
        // ControllerRegistry.middlewares.forEach(middlewareMetadata => {
        //     if (middlewareMetadata.isGlobalMiddleware && middlewareMetadata.isErrorMiddleware) {
        //         const handlerMetadata = middlewareMetadata.handler;
        //         const transformer = new HandlerTransformer(handlerMetadata);
        //         this._server.use(transformer.transform());
        //     }
        // });
    }
}