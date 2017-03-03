import * as Fs from "fs";
import {TypedPath} from "../path/TypedPath";
import * as Winston from "winston";

export class LogFactory {

    private static logger: Winston.LoggerInstance;

    public static init() {

        const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

        if (!Fs.existsSync(TypedPath.logDir)) {
            Fs.mkdirSync(TypedPath.logDir);
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
            filename: `${env}.log`,
            dirname: TypedPath.logDir,
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
