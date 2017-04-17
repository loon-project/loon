import * as Path from "path";
import {ConfigContainer} from "../config/ConfigContainer";
import * as Knex from "knex";

export class ConnectionFactory {

    private static connection: Knex;

    public static init(configDir: string, dbDir: string, env: string) {

        const databaseConfig = Path.join(configDir, 'database.json');

        ConfigContainer.registerConfig(databaseConfig);

        if (ConfigContainer.get(`database.${env}`)) {
            this.connection = Knex(ConfigContainer.get(`database.${env}`));
        } else {
            const knexfile = Path.join(dbDir, 'knexfile.js');
            this.connection(require(knexfile)[env]);
        }

    }

    public static getConnection() {
        return this.connection;
    }
}