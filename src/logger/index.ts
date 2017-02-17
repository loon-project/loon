import * as Winston from "winston";
import {Component} from "../di/decorator/Component";

export class Log {

    public static logger = Winston;

}

// let defaultLogLevel = 'debug';
// const consoleTransport: Winston.TransportInstance = new (Winston.transports.Console)({
//     colorize: true,
//     prettyPrint: true,
//     timestamp: true,
//     showLevel: true
// });
//
// const fileLogOptions = {
//     level: 'debug',
//     filename: `${this.env}.log`,
//     dirname: this.logDir,
//     timestamp: true,
//     maxFiles: 30
// };
//
// if (this.isProduction()) {
//     defaultLogLevel = 'info';
//     fileLogOptions.level = 'info';
// }
//
// const fileTransports: Winston.TransportInstance = new (Winston.transports.File)(fileLogOptions);
//
// Winston.configure({
//     level: defaultLogLevel,
//     transports: [consoleTransport, fileTransports]
// });
//
// @Component()
// export class Logger {
//     private winston = Winston;
// }
