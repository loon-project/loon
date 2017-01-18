import * as Express from "express";
import * as bodyParser from "body-parser";
import {MVCContainer} from "../mvc/MVCContainer";

// export abstract class ServerLoader {
//
//     private static app = new Express();
//     private static bodyParser = new bodyParser();
//
//     private static beforeInit() {
//
//     }
//
//     public static start() {
//
//         this.loadConfig();
//         this.loadMiddlewares();
//         this.loadRoutes();
//         this.run();
//     }
//
//     private static loadMiddlewares() {
//         this.app.use(bodyParser.urlencoded({ extended: false }));
//         this.app.use(bodyParser.json());
//     }
//
//     private static loadRoutes() {
//         MVCContainer
//             .getRoutes()
//             .map(route => this.app.use(route));
//     }
//
//     private static loadActions() {
//         this.router;
//     }
//
//     private static loadConfig() {
//     }
//
//     private static run() {
//
//
//
//         this.app.listen(8080);
//     }
// }
