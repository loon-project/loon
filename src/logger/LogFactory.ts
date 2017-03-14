import * as Winston from "winston";
import * as Path from 'path';
import {ConfigContainer} from "../config/ConfigContainer";

/**
 *
 * LogFactory for init and get logger
 *
 * logger is actually a Winston Logger instance https://github.com/winstonjs/winston/blob/master/README.md
 * use {LogConfigLoader} to transform config file to winston transport
 *
 */
export class LogFactory {

    private static logger: Winston.LoggerInstance;

    public static init(configDir: string, logDir: string, env: string) {

        const loggerConfig = Path.join(configDir, 'logger.json');

        ConfigContainer.registerConfig(loggerConfig);


        if (ConfigContainer.get(`logger.${env}`)) {

            const envLoggerConfig: any = ConfigContainer.get(`logger.${env}`);

            const transports: any[] = [];

            Object.keys(envLoggerConfig.transports).forEach(key => {
                if (Winston.transports.hasOwnProperty(key)) {
                    const transportConfig = Object.assign({}, envLoggerConfig.transports[key], {dirname: logDir});
                    const transportInstance = new (Winston.transports[key])(transportConfig);
                    transports.push(transportInstance);
                }
            });

            this.logger = new (Winston.Logger)({
                level: envLoggerConfig.level,
                transports
            });
        }
    }

    public static getLogger() {
        return this.logger;
    }
}
