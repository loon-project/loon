import * as Knex from "knex";
import * as Path from 'path';
import {ConfigContainer} from "../config/ConfigContainer";
import {Log} from "../logger/index";
import * as Winston from 'winston';
import {DIContainer} from "../di/DIContainer";

export class TypedContext {

    private static connection: Knex;

    public static init(srcDir: string, configDir: string) {

        console.log("[TYPED] => initialize configuration");
        const databaseConfig = Path.join(configDir, 'config', 'database.json');
        const applicationConfig = Path.join(configDir, 'config', 'application.json');

        let env = "development";

        if (process.env.NODE_ENV) {
            env = process.env.NODE_ENV;
        }

        ConfigContainer.registerConfig(databaseConfig);
        ConfigContainer.registerConfig(applicationConfig);

        const rootDir = this.getConfig('rootDir') ? this.getConfig('rootDir') : 'app';
        const cache = this.getConfig('cache') ? this.getConfig('cache') : false;
        const cacheStore = this.getConfig('cacheStore') ? this.getConfig('cacheStore') : 'redis';
        const logLevel = this.getConfig('logLevel') ? this.getConfig('logLevel') : 'debug';

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

        Log.logger.configure({
            level: "debug",
            transports: [
                new (Winston.transports.Console)({
                    colorize: true,
                    prettyPrint: true,
                    timestamp: true,
                    showLevel: true
                })
            ]
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