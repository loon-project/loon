import {ApplicationLoader} from "../server/ApplicationLoader";
import {ControllerRegistry} from "../mvc/ControllerRegistry";
import {Klass} from "../core/Klass";
import {DependencyRegistry} from "../di/DependencyRegistry";
import * as bodyParser from 'body-parser';
import * as Express from 'express';

export function bootstrap(klass: any, port?: number) {

    if (klass.prototype instanceof ApplicationLoader) {

        const application: ApplicationLoader = DependencyRegistry.get(<Klass> klass);

        let server;

        before(done => {
            if (typeof port !== 'undefined') {
                server = application.server.listen(port, done);
            } else {
                server = application.server.listen(application.port, done);
            }
        });

        after(done => {
            server.close(done);
        });

    } else {

        const app: Express.Application = Express();

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        let server;

        before(done => {

            if (Array.isArray(klass)) {

                klass.forEach(controller => {

                    const routes = ControllerRegistry.getRoutes(controller);

                    routes.forEach((route, baseUrl) => {
                        app.use(baseUrl, route);
                    });

                });

            } else {

                const routes = ControllerRegistry.getRoutes(klass);

                routes.forEach((route, baseUrl) => {
                    app.use(baseUrl, route);
                });
            }

            if (typeof port !== 'undefined') {
                server = app.listen(port, done);
            } else {
                throw new Error('!!! you must provide a port when test controller');
            }
        });

        after(done => {
            server.close(done);
        });
    }
}


