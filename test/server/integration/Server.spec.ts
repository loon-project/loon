import "../../TestHelper";
import {TypedApplication} from "../../../src/index";

describe("Server", () => {

    class Application extends TypedApplication {
    }

    const app = new Application();
    app.start();
});