import * as Koa from "koa";
import * as Router from "koa-router";
import * as bodyParser from "koa-bodyparser";

export abstract class ServerLoader {

    private static app: Koa = new Koa();
    private static router = new Router();
    private static bodyParser = new bodyParser();

    private static beforeInit() {

    }

    public static start() {

        this.loadConfig();
        this.loadMiddlewares();
        this.loadRoutes();
        this.run();
    }

    private static loadMiddlewares() {
        this.app.use(this.bodyParser);
    }

    private static loadRoutes() {
        this.router;
    }

    private static loadActions() {
        this.router;
    }

    private static loadConfig() {
    }

    private static run() {
        this.app.listen(8080);
    }
}
