import "../../TestHelper";
import {TypedApplication} from "../../../src/server/TypedApplication";

describe("Server", () => {

    class Application extends TypedApplication {
    }

    const app = new Application();
    app.start();
});