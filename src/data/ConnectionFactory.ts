import * as Path from "path";
import {ConfigContainer} from "../config/ConfigContainer";
import * as Knex from "knex";

export class ConnectionFactory {

    private static connection: Knex;

    public static init(configDir: string, env: string) {

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