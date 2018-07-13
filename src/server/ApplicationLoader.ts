import * as express from "express";
import * as fastify from 'fastify'
import * as glob from 'glob'
import * as http from 'http'
import * as http2 from 'http2'
import { ApplicationRegistry } from "./ApplicationRegistry";
import { DependencyRegistry } from "../di/DependencyRegistry";
import { InitializerRegistry } from "../initializer/InitializerRegistry";
import { Klass } from "../core/Klass";
import { IHandlerAdapter, ILoaderAdapter } from "../server-adapters/IAdapter";
import { FastifyHandlerAdapter, FastifyLoaderAdapter } from "../server-adapters/FastifyAdapter";
import { ConverterService } from "../converter";
import { ExpressHandlerAdapter, ExpressLoaderAdapter } from "../server-adapters/ExpressAdapter";
import { SettingOptions } from "./SettingOptions";
import { resolve } from "path";

export class ApplicationLoader {

    private _server: fastify.FastifyInstance|express.Application

    private _handlerAdapter: IHandlerAdapter

    private _loaderAdapter: ILoaderAdapter

    private _env: string;

    private _rootDir?: string

    private _files?: string

    private _port: string;

    private _host: string

    private _backlog: number

    /**
     * Load user defined settings into ApplicationLoader
     * Initialize settings
     */
    constructor(typeOrServer: string|fastify.FastifyInstance|express.Application, settings?: SettingOptions) {

        const _settings = Object.assign({}, ApplicationRegistry.settings, settings)

        if (typeOrServer === 'express') {
            this._server = express() as express.Application
            this._server.use(require('body-parser').text())
            this._server.use(require('body-parser').json())
            this._server.use(require('body-parser').urlencoded({ extended: true }))
            this._server.use(require('method-override')())
        } else if (typeOrServer === 'fastify') {
            this._server = fastify() as fastify.FastifyInstance
            this._server.register(require('fastify-formbody'))
            this._server.addContentTypeParser('text/plain', {parseAs: 'string'}, async (req, body) => {
                return body
            })
        } else {
            this._server = <fastify.FastifyInstance|express.Application>typeOrServer
        }

        if (this._isFastify()) {
            this._handlerAdapter = new FastifyHandlerAdapter(new ConverterService())
            this._loaderAdapter = new FastifyLoaderAdapter(this._server as fastify.FastifyInstance, this._handlerAdapter)
        } else if (this._isExpress()) {
            this._handlerAdapter = new ExpressHandlerAdapter(new ConverterService())
            this._loaderAdapter = new ExpressLoaderAdapter(this._server as express.Application, this._handlerAdapter)
        } else {
            throw 'server is not supported, use express and fastify'
        }

        this._env = process.env.NODE_ENV || _settings.env || 'development';
        this._port = process.env.PORT || _settings.port || '9000';
        this._host = process.env.HOST || _settings.host || '0.0.0.0'
        this._backlog = process.env.BACKLOG as any || _settings.backlog || 511
        this._rootDir = _settings.rootDir;
        this._files = _settings.files

        DependencyRegistry.set(<Klass> ApplicationLoader, this);
    }

    private async _loadComponents() {

        if (this._files) {
            glob.sync(this._files).forEach(file => require(file))
        }

        if (this._rootDir) {
            if (this._env === 'development') {
                glob.sync(`${this._rootDir}/**/*.ts`).forEach(file => require(file))
            } else {
                glob.sync(`${this._rootDir}/**/*.js`).forEach(file => require(file))
            }
        }

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

    public async start() {
        try {
            await this._loadComponents()
            await this._init()
            await this._loadMiddlewares()
            await this._loadControllers()
            await this._loadErrorMiddlewares()
        } catch (e) {
            throw e
        }

        return new Promise((resolve, reject) => {
            if (this._isExpress()) {
                const server = (this._server as any).listen(this._port, this._host, this._backlog, (err) => {
                    if (err) reject(err)
                    resolve(server)
                })
            } else if (this._isFastify()) {
                (this._server as any).listen(this._port, this._host, this._backlog, (err) => {
                    if (err) reject(err)
                    resolve((this._server as fastify.FastifyInstance).server)
                })
            } else {
                throw 'framework error'
            }
        })
    }

    public 

    private _isExpress() {
        return !!(this._server as express.Application)['m-search']
    }

    private _isFastify() {
        return !!(this._server as fastify.FastifyInstance).setErrorHandler
    }
}

