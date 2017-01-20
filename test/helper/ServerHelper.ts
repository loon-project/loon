import * as Express from "express";
import * as bodyParser from 'body-parser';

export class ServerHelper {

    public static simpleServer(): Express.Application {

        const app = Express();

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        return app;
    }
}