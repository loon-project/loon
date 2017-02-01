import * as Knex from "knex";
import * as Path from 'path';
import {ConfigContainer} from "../config/ConfigContainer";
import {Log} from "../logger/index";
import * as Winston from 'winston';
import {DIContainer} from "../di/DIContainer";
import {TypedApplicationOption} from "./TypedApplicationOption";

export class TypedContext {

    private static connection: Knex;

    public static init(rootDir: string, options: TypedApplicationOption) {

        let env = "development";

        if (process.env.NODE_ENV) {
            env = process.env.NODE_ENV;
        }

        const srcDir = options.srcDir ? options.srcDir : Path.resolve(rootDir, 'app');
        const logDir = options.logDir ? options.logDir : Path.resolve(rootDir, 'log');
        const configDir = options.configDir ? options.configDir : Path.resolve(rootDir, 'config');

        console.log("[TYPED] => initialize configuration");
        const databaseConfig = Path.join(configDir, 'config', 'database.json');
        const applicationConfig = Path.join(configDir, 'config', 'application.json');
        ConfigContainer.registerConfig(databaseConfig);
        ConfigContainer.registerConfig(applicationConfig);


        if (this.getConfig("database")) {
            console.log("[TYPED] => initialize database");
            TypedContext.connection = Knex(this.getConfig(`database.${env}`));
        }

        console.log("[TYPED] => initialize beans");
        require('require-all')({
            dirname     :  srcDir,
            excludeDirs :  /^\.(git|svn|node_modules)$/,
            recursive   : true
        });

        console.log("[TYPED] => initialize logger");

        const defaultLogLevel = env === 'production' ? 'info' : 'debug';
        const defaultTransports = [
            new (Winston.transports.Console)({
                colorize: true,
                prettyPrint: true,
                timestamp: true,
                showLevel: true
            }),
            new (Winston.transports.DailyRotateFile)({
                filename: `${env}.log`,
                dirname: logDir,
                maxFiles: 30
            })
        ];

        Log.logger.configure({
            level: defaultLogLevel,
            transports: defaultTransports
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
}