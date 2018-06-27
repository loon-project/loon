import * as express from "express";
import * as fastify from 'fastify'
import * as fs from "fs";
import * as http from 'http'
import * as path from 'path'
import * as findUp from 'find-up'
import {ApplicationRegistry} from "./ApplicationRegistry";
import {ControllerRegistry} from "../mvc/ControllerRegistry";
import {HandlerTransformer} from "../mvc/HandlerTransformer";
import {ControllerTransformer} from "../mvc/ControllerTransformer";
import {MiddlewareRegistry} from "../mvc/MiddlewareRegistry";
import {DependencyRegistry} from "../di/DependencyRegistry";
import {InitializerRegistry} from "../initializer/InitializerRegistry";
import {Klass} from "../core/Klass";
import {Request} from "../mvc/interface/Request";
import {RouterLogger} from "../util/RouterLogger";

export class ApplicationLoader {

    private _server: fastify.FastifyInstance

    private _env: string;

    private _rootDir: string;

    private _srcDir: string;

    private _publicDir: string;

    private _logDir: string;

    private _configDir: string;

    private _dbDir: string;

    private _port: string;

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

    get port(): string {
        return this._port;
    }

    /**
     * Load user defined settings into ApplicationLoader
     * Initialize settings
     */
    constructor(server?: fastify.FastifyInstance) {

        const settings = ApplicationRegistry.settings;

        if (server) {
            this._server = server
        } else {
            this._server = fastify()
        }

        this._env = process.env.NODE_ENV || settings.env || 'development';
        this._rootDir = settings.rootDir;

        // Assign user defined folder structure to ApplicationLoader
        // If no such folder, then create it
        // to simplify, only require src folder 
        // ['src', 'public', 'log', 'config', 'db'].map(item => {
        ['src'].map(item => {
            this[`_${item}Dir`] = settings[`${item}Dir`] || `${this._rootDir}/${item}`;

            if (!fs.existsSync(this[`_${item}Dir`]) && this._env !== 'test') {
                fs.mkdirSync(this[`_${item}Dir`]);
            }
        });


        this._port = process.env.PORT || settings.port || '9000';
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

        // MiddlewareRegistry
        //     .getMiddlewares({isErrorMiddleware: false})
        //     .forEach(middlewareMetadata => {
        //         const handlerMetadata = middlewareMetadata.handler;
        //         const transformer = new HandlerTransformer(handlerMetadata);
        //         this._server.register((ins, options, next) => {
        //             ins.use(transformer.transform())
        //             next()
        //         }, {prefix: middlewareMetadata.baseUrl})
        //    });


        '$afterLoadMiddlewares' in this ? await (<any> this).$afterLoadMiddlewares() : null;

        return this;
    }

    private async loadRoutes() {

        '$beforeLoadRoutes' in this ? await (<any> this).$beforeLoadRoutes() : null;

        ControllerRegistry.controllers.forEach(controllerMetadata => {
            function controller(fasifyInstance, opts, next) {
                const transformer = new ControllerTransformer(controllerMetadata, fasifyInstance)
                transformer.transform()
                next()
            }
            const opts = {prefix: controllerMetadata.baseUrl}
            this._server
                .register(controller, opts)
        });

        '$afterLoadRoutes' in this ? await (<any> this).$afterLoadRoutes() : null;
        return this;
    }

    private async loadErrorMiddlewares() {

        '$beforeLoadErrorMiddlewares' in this ? await (<any> this).$beforeLoadErrorMiddlewares() : null;

        // MiddlewareRegistry
        //     .getMiddlewares({isErrorMiddleware: true})
        //     .forEach(middlewareMetadata => {
        //         const handlerMetadata = middlewareMetadata.handler;
        //         const transformer = new HandlerTransformer(handlerMetadata);
        //         this._server.register((ins, options, next) => {
        //             ins.setErrorHandler(transformer.transformErrorHandler())
        //             next()
        //         }, {prefix: middlewareMetadata.baseUrl})
        //     });

        '$afterLoadErrorMiddlewares' in this ? await (<any> this).$afterLoadErrorMiddlewares() : null;

        return this;
    }

    public async start() {

        try {
            await this.loadComponents();
            await this.init();
            await this.loadMiddlewares();
            await this.loadRoutes();
            await this.loadErrorMiddlewares();
        } catch (e) {
            throw new Error('failed to run application');
        }

        this._server
            .listen(this.port, err => {
                if (err) console.log(err)
                console.log(RouterLogger.toString());
                console.log('server is start')
            })
    }
}

