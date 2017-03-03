import {ApplicationRegistry} from "./ApplicationRegistry";
import * as Express from "express";

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

    private _routes: {[key: string]: string};

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
        this._srcDir = settings.srcDir || `${this._rootDir}/src`;
        this._publicDir = settings.publicDir || `${this._rootDir}/public`;
        this._logDir = settings.logDir || `${this._rootDir}/log`;
        this._configDir = settings.configDir || `${this._rootDir}/config`;
        this._dbDir = settings.dbDir || `${this._rootDir}/db`;

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
     * Run $onInit hooks if user defined
     *
     * @returns {Promise<any>}
     */
    private init() {

        return Promise
            .resolve()
            .then(() => {})
            .then(() => '$onInit' in this ? (<any>this).$onInit() : null)
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
            .then(() => this.loadErrorHandlers());

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
            })
            .catch(() => {
            });
    }

    private scan(paths: string[]) {

        paths.forEach(path => {
            require('require-all')({
                dirname: path,
                excludeDirs :  /^\.(git|svn)$/,
                recursive: true
            });
        });

        return this;
    }

    private loadMiddlewares() {
    }

    private loadRoutes() {
    }

    private loadErrorHandlers() {
    }
}