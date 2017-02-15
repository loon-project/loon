import * as Knex from "knex";
import * as Path from "path";
import {ConfigContainer} from "../config/ConfigContainer";
import {Log} from "../logger/index";
import * as Winston from "winston";
import {DIContainer} from "../di/DIContainer";
import {TypedApplicationOption} from "./TypedApplicationOption";
import * as _ from "lodash";
import * as Fs from "fs";

export class TypedContext {

    private static connection: Knex;

    public static rootDir;
    public static srcDir;
    public static publicDir;
    public static logDir;
    public static configDir;
    public static dbDir;
    public static viewDir;
    public static assetsDir;

    public static env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

    public static isDevelopment() {
        return this.env === 'development';
    }

    public static isTest() {
        return this.env === 'test';
    }

    public static isProduction() {
        return this.env === 'production';
    }

    public static init(options: TypedApplicationOption) {

        if (_.isEmpty(options)) {
            options = {};
        }

        this.rootDir = options.rootDir ? options.rootDir : __dirname;
        this.srcDir = options.srcDir ? options.srcDir : Path.resolve(this.rootDir, 'src');
        this.logDir = options.logDir ? options.logDir : Path.resolve(this.rootDir, 'log');
        this.configDir = options.configDir ? options.configDir : Path.resolve(this.rootDir, 'config');
        this.assetsDir = options.assetsDir ? options.assetsDir : Path.resolve(this.rootDir, 'assets');
        this.publicDir = options.publicDir ? options.publicDir : Path.resolve(this.rootDir, 'public');
        this.viewDir = options.viewsDir ? options.viewsDir : Path.resolve(this.srcDir, 'views');

        const databaseConfig = Path.join(this.configDir, 'database.json');
        const applicationConfig = Path.join(this.configDir, 'application.json');
        ConfigContainer.registerConfig(databaseConfig);
        ConfigContainer.registerConfig(applicationConfig);


        if (this.getConfig("database")) {
            TypedContext.connection = Knex(this.getConfig(`database.${this.env}`));
        }

        require('require-all')({
            dirname     :  this.srcDir,
            excludeDirs :  new RegExp(`^\.(git|svn|node_modules|${this.assetsDir}|${this.viewDir}|${this.configDir}|${this.logDir}})$`),
            recursive   : true
        });

        if (!Fs.existsSync(this.logDir)) {
            Fs.mkdirSync(this.logDir);
        }

        let defaultLogLevel = 'debug';
        const consoleTransport: Winston.TransportInstance = new (Winston.transports.Console)({
            colorize: true,
            prettyPrint: true,
            timestamp: true,
            showLevel: true
        });

        const fileLogOptions = {
            level: 'debug',
            filename: `${this.env}.log`,
            dirname: this.logDir,
            timestamp: true,
            maxFiles: 30
        };

        if (this.isProduction()) {
            defaultLogLevel = 'info';
            fileLogOptions.level = 'info';
        }

        const fileTransports: Winston.TransportInstance = new (Winston.transports.File)(fileLogOptions);

        Log.logger.configure({
            level: defaultLogLevel,
            transports: [consoleTransport, fileTransports]
        });
    }

    public static getConfig(expression: string) {
        return ConfigContainer.get(expression);
    }

    public static getBean(nameOrType: string|Function) {
        return DIContainer.get(nameOrType);
    }

    public static getLogger() {
        return Log.logger;
    }

    public static getConnection() {
        return this.connection;
    }
}