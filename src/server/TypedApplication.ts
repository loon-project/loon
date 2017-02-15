import {TypedContext} from "./TypedContext";
import {ServerContainer} from "./ServerContainer";
import {TypedServer} from "./TypedServer";

export class TypedApplication {

    public static run() {
        TypedContext.init(ServerContainer.options);
        const server = new TypedServer();
        server.start();
    }

}