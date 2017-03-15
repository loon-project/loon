import {ApplicationRegistry} from "./ApplicationRegistry";
import * as Express from "express";
import {LogFactory} from "../logger/LogFactory";
import {ConnectionFactory} from "../data/ConnectionFactory";
import * as Fs from "fs";
import {ControllerRegistry} from "../mvc/ControllerRegistry";
import {HandlerTransformer} from "../mvc/HandlerTransformer";
import {ControllerTransformer} from "../mvc/ControllerTransformer";
import {MiddlewareRegistry} from "../mvc/MiddlewareRegistry";
import {DependencyRegistry} from "../di/DependencyRegistry";
import {InitializerRegistry} from "../initializer/InitializerRegistry";
import {Klass} from "../core/Klass";


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

        DependencyRegistry.set(ApplicationLoader, this);
    }

    public start(): Promise<any> {

        return Promise
            .resolve()
            .then(() => this.init())
            .then(() => this.invokeApplicationInitHook())
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
            .then(() => this.loadComponents())
            .then(() => this.loadMiddlewares())
            .then(() => this.loadRoutes())
            .then(() => this.loadErrorMiddlewares())
            .then(() => this.run())
            .catch(e => {
                throw e;
            });
    }


    private init() {

        InitializerRegistry
            .getInitializers()
            .forEach(initializer => {
                const instance = DependencyRegistry.get(<Klass>initializer.type);
                instance['init'].apply(instance);
            });

        LogFactory.init(this.configDir, this.logDir, this.env);
        ConnectionFactory.init(this.configDir, this.env);
    }

    private invokeApplicationInitHook() {
        '$onInit' in this ? (<any> this).$onInit() : null;
    }

    private loadComponents() {

        require('require-all')({
            dirname     :  this.srcDir,
            excludeDirs :  new RegExp(`^\.(git|svn|node_modules|${this.configDir}|${this.logDir}})$`),
            recursive   : true
        });
    }

    private loadMiddlewares() {

        MiddlewareRegistry
            .getMiddlewares({isErrorMiddleware: false})
            .forEach(middlewareMetadata => {
                const handlerMetadata = middlewareMetadata.handler;
                const transformer = new HandlerTransformer(handlerMetadata);
                this._server.use(middlewareMetadata.baseUrl, transformer.transform());
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

        MiddlewareRegistry
            .getMiddlewares({isErrorMiddleware: true})
            .forEach(middlewareMetadata => {
                const handlerMetadata = middlewareMetadata.handler;
                const transformer = new HandlerTransformer(handlerMetadata);
                this._server.use(middlewareMetadata.baseUrl, transformer.transform());
            });
    }

    private run() {
        this.server.listen(this.port, () => {
            const logger = LogFactory.getLogger();
            logger.info(`Application is listening on port ${this.port}`);
        });
    }

}