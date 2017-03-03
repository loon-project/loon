import {TypedPath} from "../path/TypedPath";
import * as Path from 'path';
import {ConfigContainer} from "../config/ConfigContainer";
import * as Knex from 'knex';

export class DBConnectionFactory {

    private static connection: Knex;

    public static init() {

        const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
        const configDir = TypedPath.configDir;
        const databaseConfig = Path.join(configDir, 'database.json');

        ConfigContainer.registerConfig(databaseConfig);

        if (ConfigContainer.get("database")) {
            this.connection = Knex(ConfigContainer.get(`database.${env}`));
        }

    }

    public static getConnection() {
        return this.connection;
    }
}