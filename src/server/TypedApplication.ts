import {TypedContext} from "./TypedContext";
import {ServerContainer} from "./ServerContainer";
import {TypedServer} from "./TypedServer";

export class TypedApplication {

    private static middlewares: ((req, res, next) => any)[] = [];

    public static use(middleware: (req, res, next) => any) {
        this.middlewares.push(middleware);
    }

    public static run() {
        TypedContext.init(ServerContainer.options);
        const server = new TypedServer();
        this.middlewares.map(server.use);
        server.start();
    }

}