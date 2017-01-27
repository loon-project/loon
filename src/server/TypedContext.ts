import * as Knex from "knex";
import * as Path from 'path';
import {ConfigContainer} from "../config/ConfigContainer";
import {Log} from "../logger/index";
import * as Winston from 'winston';

export class TypedContext {

    private static connection: Knex;

    public static init() {
        console.log("[TYPED] => booting application");

        console.log("[TYPED] initialize configuration");
        const databaseConfig = Path.join(process.cwd(), 'config', 'database.json');
        const applicationConfig = Path.join(process.cwd(), 'config', 'application.json');

        ConfigContainer.registerConfig(databaseConfig);
        ConfigContainer.registerConfig(applicationConfig);

        console.log("[TYPED] initialize database");
        TypedContext.connection = Knex({

        });


        console.log("[TYPED] initialize beans");
        require('require-all')({
            dirname     :  process.cwd() + '/app',
            excludeDirs :  /^\.(git|svn|node_modules)$/,
            recursive   : true
        });

        console.log("[TYPED] initialize logger");
        let env;
        if (process.env.NODE_ENV) {
            env = process.env.NODE_ENV;
        } else {
            env = "development";
        }

        Log.logger.configure({
            level: "debug",
            transports: [
                new (Winston.transports.Console)(),
                new (Winston.transports.File)({filename: `${env}.log`})
            ]
        });
    }

    public static getConfig(expression: string) {

        ConfigContainer.get(expression);
    }

    public static getBean() {
    }

    public static getLogger() {
    }

    public static setDatabaseConnection() {
    }

    public static getDatabaseConnection(): Promise<Knex> {

        return new Promise<Knex>((resolve, _) => {

            if (TypedContext.connection) {
                resolve(TypedContext.connection);
            }

            TypedContext.connection = Knex({

                client: '',

                connection: {

                },

                pool: {

                }
            });

            resolve(TypedContext.connection);
        });
    }
}