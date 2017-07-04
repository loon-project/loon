import {ApplicationRegistry} from "./ApplicationRegistry";
import * as Express from "express";
import * as Fs from "fs";
import {ControllerRegistry} from "../mvc/ControllerRegistry";
import {HandlerTransformer} from "../mvc/HandlerTransformer";
import {ControllerTransformer} from "../mvc/ControllerTransformer";
import {MiddlewareRegistry} from "../mvc/MiddlewareRegistry";
import {DependencyRegistry} from "../di/DependencyRegistry";
import {InitializerRegistry} from "../initializer/InitializerRegistry";
import {Klass} from "../core/Klass";
import {Request} from "../mvc/interface/Request";

export class ApplicationLoader {

    private _server: Express.Application;

    private _env: string;

    private _rootDir: string;

    private _srcDir: string;

    private _publicDir: string;

    private _logDir: string;

    private _configDir: string;

    private _dbDir: string;

    private _port: string | number;

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

    get port(): string | number {
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

        DependencyRegistry.set(<Klass> ApplicationLoader, this);
    }

    private async init() {

        '$beforeInit' in this ? await (<any> this).$beforeInit() : null;

        InitializerRegistry
            .getInitializers()
            .forEach(async initializer => {
                const instance = DependencyRegistry.get(<Klass>initializer.type);
                await instance['init'].apply(instance);
            });

        '$afterInit' in this ? await (<any> this).$afterInit() : null;

        return this;
    }

    private async loadComponents() {

        require('require-all')({
            dirname     :  this.srcDir,
            excludeDirs :  new RegExp(`^\.(git|svn|node_modules|${this.configDir}|${this.logDir}})$`),
            recursive   : true
        });

        return this;
    }

    private async loadMiddlewares() {

        '$beforeLoadMiddlewares' in this ? await (<any> this).$beforeLoadMiddlewares() : null;

        this.server.use((req: Request, res, next) => {
          req.id = require('cuid')();
          next();
        });

        this.server.use(require('body-parser').json());
        this.server.use(require('body-parser').urlencoded({ extended: true }));
        this.server.use(require('cookie-parser')());
        this.server.use(require('method-override')());
        this.server.use(require('serve-static')(this.publicDir));

        MiddlewareRegistry
            .getMiddlewares({isErrorMiddleware: false})
            .forEach(middlewareMetadata => {
                const handlerMetadata = middlewareMetadata.handler;
                const transformer = new HandlerTransformer(handlerMetadata);
                this._server.use(middlewareMetadata.baseUrl, transformer.transform());
            });


        '$afterLoadMiddlewares' in this ? await (<any> this).$afterLoadMiddlewares() : null;

        return this;
    }

    private async loadRoutes() {

        '$beforeLoadRoutes' in this ? await (<any> this).$beforeLoadRoutes() : null;

        ControllerRegistry.controllers.forEach(controllerMetadata => {
            const transformer = new ControllerTransformer(controllerMetadata);
            const router = transformer.transform();
            this._server.use(controllerMetadata.baseUrl, router);
        });

        '$afterLoadRoutes' in this ? await (<any> this).$afterLoadRoutes() : null;

        return this;
    }

    private async loadErrorMiddlewares() {

        '$beforeLoadErrorMiddlewares' in this ? await (<any> this).$beforeLoadErrorMiddlewares() : null;

        MiddlewareRegistry
            .getMiddlewares({isErrorMiddleware: true})
            .forEach(middlewareMetadata => {
                const handlerMetadata = middlewareMetadata.handler;
                const transformer = new HandlerTransformer(handlerMetadata);
                this._server.use(middlewareMetadata.baseUrl, transformer.transform());
            });

        '$afterLoadErrorMiddlewares' in this ? await (<any> this).$afterLoadErrorMiddlewares() : null;

        return this;
    }

    private async run() {

        try {
            await this.init();
            await this.loadComponents();
            await this.loadMiddlewares();
            await this.loadRoutes();
            await this.loadErrorMiddlewares();
        } catch (e) {
          throw new Error('failed to run application');
        }

        this.server.listen(this.port, () => {
            console.log(`Application is listening on port ${this.port}`);
        });
    }
}