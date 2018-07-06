import * as express from "express";
import * as fastify from 'fastify'
import * as fs from "fs";
import { ApplicationRegistry } from "./ApplicationRegistry";
import { DependencyRegistry } from "../di/DependencyRegistry";
import { InitializerRegistry } from "../initializer/InitializerRegistry";
import { Klass } from "../core/Klass";
import { IHandlerAdapter, ILoaderAdapter } from "../server-adapters/IAdapter";
import { FastifyHandlerAdapter, FastifyLoaderAdapter } from "../server-adapters/FastifyAdapter";
import { ConverterService } from "../converter";
import { ExpressHandlerAdapter, ExpressLoaderAdapter } from "../server-adapters/ExpressAdapter";

export class ApplicationLoader {

    private _server: fastify.FastifyInstance|express.Application

    private _handlerAdapter: IHandlerAdapter

    private _loaderAdapter: ILoaderAdapter

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
    constructor(typeOrServer: string|fastify.FastifyInstance|express.Application) {

        const settings = ApplicationRegistry.settings;

        if (typeOrServer === 'express') {
            this._server = express() as express.Application
            this._server.use(require('body-parser').json())
            this._server.use(require('body-parser').urlencoded({ extended: true }))
            this._server.use(require('method-override')())
        } else if (typeOrServer === 'fastify') {
            this._server = fastify()
        } else {
            this._server = <fastify.FastifyInstance|express.Application>typeOrServer
        }

        if ((this._server as fastify.FastifyInstance).setErrorHandler) {
            this._handlerAdapter = new FastifyHandlerAdapter(new ConverterService())
            this._loaderAdapter = new FastifyLoaderAdapter(this._server as fastify.FastifyInstance, this._handlerAdapter)
        } else if ((this._server as express.Application)['m-search']) {
            this._handlerAdapter = new ExpressHandlerAdapter(new ConverterService())
            this._loaderAdapter = new ExpressLoaderAdapter(this._server as express.Application, this._handlerAdapter)
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

    private async _loadComponents() {
        require('require-all')({
            dirname     :  this.srcDir,
            excludeDirs :  new RegExp(`^\.(git|svn|node_modules|${this.configDir}|${this.logDir}})$`),
            recursive   : true
        });
        return this;
    }

    private async _init() {
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

    private async _loadMiddlewares() {
        '$beforeLoadMiddlewares' in this ? await (<any> this).$beforeLoadMiddlewares() : null;
        this._loaderAdapter.loadMiddlewares()
        '$afterLoadMiddlewares' in this ? await (<any> this).$afterLoadMiddlewares() : null;
        return this;
    }

    private async _loadControllers() {
        '$beforeLoadRoutes' in this ? await (<any> this).$beforeLoadRoutes() : null;
        this._loaderAdapter.loadControllers()
        '$afterLoadRoutes' in this ? await (<any> this).$afterLoadRoutes() : null;
        return this;
    }

    private async _loadErrorMiddlewares() {
        '$beforeLoadErrorMiddlewares' in this ? await (<any> this).$beforeLoadErrorMiddlewares() : null;
        this._loaderAdapter.loadErrorMiddlewares()
        '$afterLoadErrorMiddlewares' in this ? await (<any> this).$afterLoadErrorMiddlewares() : null;
        return this;
    }

    public async init() {
        try {
            await this._loadComponents()
            await this._init()
            await this._loadMiddlewares()
            await this._loadControllers()
            await this._loadErrorMiddlewares()
        } catch (e) {
            throw e
        }

        return this._server
    }
}

