import {ApplicationRegistry} from "./ApplicationRegistry";
import * as Express from "express";

export class ApplicationLoader {

    private server: Express.Application;
    private env: string;

    constructor() {
        this.server = Express();
        this.env = process.env.NODE_ENV || ApplicationRegistry.settings.env;

        this.scan([]);
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
            .then(() => {

            })
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