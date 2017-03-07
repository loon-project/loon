import * as Winston from "winston";

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

    public static init(logDir: string, env: string) {

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
            dirname: logDir,
            timestamp: true,
            maxFiles: 30
        };

        if (env === 'production') {
            defaultLogLevel = 'info';
            fileLogOptions.level = 'info';
        }

        const fileTransports: Winston.TransportInstance = new (Winston.transports.File)(fileLogOptions);


        this.logger = new (Winston.Logger)({
            level: defaultLogLevel,
            transports: [consoleTransport, fileTransports]
        });
    }

    public static getLogger() {
        return this.logger;
    }
}
