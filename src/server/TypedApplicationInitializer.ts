import {TypedContext} from "./TypedContext";
import {TypedServer} from "./TypedApplication";
import {ServerContainer} from "./ServerContainer";

export class TypedApplicationInitializer {

    init() {

        const options = ServerContainer.options;

        TypedContext.init(options);

    }

    start() {

        const server = new TypedServer(ServerContainer.application);
        server.start();

    }
}
