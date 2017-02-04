import * as Knex from "knex";
import * as Path from 'path';
import {ConfigContainer} from "../config/ConfigContainer";
import {Log} from "../logger/index";
import * as Winston from 'winston';
import * as WinstonDailyRotateFile from 'winston-daily-rotate-file';
import {DIContainer} from "../di/DIContainer";
import {TypedApplicationOption} from "./TypedApplicationOption";

Winston.transports.DailyRotateFile = WinstonDailyRotateFile;

export class TypedContext {

    private static connection: Knex;

    public static rootDir;
    public static srcDir;
    public static publicDir;
    public static logDir;
    public static configDir;
    public static dbDir;




    public static init(rootDir: string, options: TypedApplicationOption) {

        this.rootDir = rootDir;
        this.srcDir = options.srcDir ? options.srcDir : Path.resolve(rootDir, 'src');
        this.logDir = options.logDir ? options.logDir : Path.resolve(rootDir, 'logs');
        this.configDir = options.configDir ? options.configDir : Path.resolve(rootDir, 'config');

        let env = "development";

        if (process.env.NODE_ENV) {
            env = process.env.NODE_ENV;
        }

        console.log("[TYPED] => initialize configuration");
        const databaseConfig = Path.join(this.configDir, 'database.json');
        const applicationConfig = Path.join(this.configDir, 'application.json');
        ConfigContainer.registerConfig(databaseConfig);
        ConfigContainer.registerConfig(applicationConfig);


        if (this.getConfig("database")) {
            console.log("[TYPED] => initialize database");
            TypedContext.connection = Knex(this.getConfig(`database.${env}`));
        }

        console.log("[TYPED] => initialize beans");
        require('require-all')({
            dirname     :  this.srcDir,
            excludeDirs :  /^\.(git|svn|node_modules)$/,
            recursive   : true
        });

        console.log("[TYPED] => initialize logger");

        let defaultLogLevel = 'debug';
        const consoleTransport: Winston.TransportInstance = new (Winston.transports.Console)({
            colorize: true,
            prettyPrint: true,
            timestamp: true,
            showLevel: true
        });

        const fileLogOptions = {
            level: 'debug',
            filename: `${env}.log`,
            dirname: this.logDir,
            timestamp: true,
            maxFiles: 30
        };

        if (env === 'production') {
            defaultLogLevel = 'info';
            fileLogOptions.level = 'info';
        }

        const fileTransports: Winston.TransportInstance = new (Winston.transports.DailyRotateFile)(fileLogOptions);

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