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
const debug = require('debug')('loon:ApplicationLoader');

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

    private _ext: string

    private _lazyInit: boolean;

    get server() {
        return this._server;
    }

    get env() {
        return this._env;
    }

    get rootDir() {
        return this._rootDir;
    }

    get files() {
        return this._files;
    }

    get port() {
        return this._port;
    }

    get host() {
        return this._host;
    }

    get backlog() {
        return this._backlog;
    }

    private $onClose: (...args: any[]) => any;

    /**
     * Load user defined settings into ApplicationLoader
     * Initialize settings
     */
    constructor(typeOrServer: string|fastify.FastifyInstance|express.Application, settings?: SettingOptions) {

        const _settings = Object.assign({}, ApplicationRegistry.settings, settings)

        if (typeOrServer === 'express') {
            debug('built in express server');
            this._server = express() as express.Application
            this._server.use(require('body-parser').text())
            this._server.use(require('body-parser').json())
            this._server.use(require('body-parser').urlencoded({ extended: true }))
            this._server.use(require('method-override')())
        } else if (typeOrServer === 'fastify') {
            debug('built in fastify server');
            if (settings && settings.serverOpts) {
                this._server = fastify(settings.serverOpts) as fastify.FastifyInstance
            } else {
                this._server = fastify() as fastify.FastifyInstance
            }
            this._server.register(require('fastify-formbody'))
            this._server.addContentTypeParser('text/plain', {parseAs: 'string'}, async (req, body) => {
                return body
            })
        } else {
            debug('custom express or fastify server');
            this._server = <fastify.FastifyInstance|express.Application>typeOrServer
        }

        if (this._isFastify()) {
            debug('is fastify server');
            this._handlerAdapter = new FastifyHandlerAdapter(new ConverterService())
            this._loaderAdapter = new FastifyLoaderAdapter(this._server as fastify.FastifyInstance, this._handlerAdapter)
        } else if (this._isExpress()) {
            debug('is express server');
            this._handlerAdapter = new ExpressHandlerAdapter(new ConverterService())
            this._loaderAdapter = new ExpressLoaderAdapter(this._server as express.Application, this._handlerAdapter)
        } else {
            throw 'server is not supported, use express and fastify'
        }

        this._env = process.env.NODE_ENV || _settings.env || 'development';
        debug(`env: ${this._env}`);

        this._port = process.env.PORT || _settings.port || '9000';
        debug(`port: ${this._port}`);

        this._host = process.env.HOST || _settings.host || '0.0.0.0'
        debug(`host: ${this._host}`);

        this._backlog = process.env.BACKLOG as any || _settings.backlog || 511
        debug(`backlog: ${this._backlog}`);

        this._ext = process.env.EXT || _settings.ext || 'js'
        this._lazyInit = _settings.lazyInit === true ? true : false;

        this._rootDir = _settings.rootDir;
        this._files = _settings.files

        DependencyRegistry.set(<Klass> ApplicationLoader, this);
    }

    private async _loadComponents() {
        debug('_loadComponents');

        if (this._files) {
            debug('files load mode');
            glob.sync(this._files).forEach(file => {
                debug(file);
                require(file)
            })
        }

        if (this._rootDir) {
            debug('rootDir load mode');
            glob.sync(`${this._rootDir}/**/*.${this._ext}`).forEach(file => {
                debug(file);
                require(file)
            })
        }

        return this;
    }

    private async _initializeComponents() {
        // by default, after load all components, do initialization
        // if set as lazyInit, initialize component when being used
        if (!this._lazyInit) {
            debug('_initializeComponents');
            DependencyRegistry.components.forEach(component => {
                debug(`initialize component: ${component.klass.name}`);
                DependencyRegistry.init(component.klass)
            });
        }
        return this;
    }

    private async _init() {
        debug('_init');

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
        debug('_loadMiddlewares');

        '$beforeLoadMiddlewares' in this ? await (<any> this).$beforeLoadMiddlewares() : null;
        this._loaderAdapter.loadMiddlewares()
        '$afterLoadMiddlewares' in this ? await (<any> this).$afterLoadMiddlewares() : null;
        return this;
    }

    private async _loadControllers() {
        debug('_loadControllers');

        '$beforeLoadControllers' in this ? await (<any> this).$beforeLoadControllers() : null;
        this._loaderAdapter.loadControllers()
        '$afterLoadControllers' in this ? await (<any> this).$afterLoadControllers() : null;
        return this;
    }

    private async _loadErrorMiddlewares() {
        debug('_loadErrorMiddlewares');

        '$beforeLoadErrorMiddlewares' in this ? await (<any> this).$beforeLoadErrorMiddlewares() : null;
        this._loaderAdapter.loadErrorMiddlewares()
        '$afterLoadErrorMiddlewares' in this ? await (<any> this).$afterLoadErrorMiddlewares() : null;
        return this;
    }

    public async start() {
        debug('start');

        try {
            await this._loadComponents()
            await this._initializeComponents()
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
                throw 'server type unsupported error';
            }
        }).then((server: http.Server) => {
            const SIG = ['SIGINT', 'SIGTERM'];

            SIG.forEach(signal => {
                process.on(signal as any, () => {
                    console.log(`receiving signal: ${signal}`);

                    server.close(err => {
                        if (err) {
                            console.error(err.message);
                            process.exit(1);
                        }

                        const closeServer = () => {
                            if ('$onClose' in this) {
                                const onClose = this.$onClose();
                                if (onClose.then && typeof onClose.then === 'function') {
                                    onClose.then(() => {
                                        process.exit(0);
                                    })
                                } else {
                                    process.exit(0);
                                }
                            } else {
                                process.exit(0);
                            }
                       };

                       closeServer();

                       setTimeout(() => {
                            console.error('could not close http/resource connection in time, force shuting down');
                            closeServer();
                        }, 10 * 1000);
                    });
                });
            });

            return server;
        });
    }

    private _isExpress() {
        return !!(this._server as express.Application)['m-search']
    }

    private _isFastify() {
        return !!(this._server as fastify.FastifyInstance).setErrorHandler
    }
}

