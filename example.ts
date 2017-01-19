import "./test/TestHelper";
import {BodyParam, HeaderParam, PathParam} from "./src/mvc/decorator/Params";
import {Post, Get} from "./src/mvc/decorator/Method";
import {Controller} from "./src/mvc/decorator/Controller";
import {ServerHelper} from "./test/helper/ServerHelper";
import {MVCContainer} from "./src/mvc/MVCContainer";

@Controller("/")
class User2Controller {

    @Get("/users")
    public indexAction(@HeaderParam("Authorization") authorization: string) {
        return authorization;
    }

    @Get("/users/:id")
    public showAction(@PathParam("id") id: number) {
        return id;
    }

    @Post("/users")
    public createAction(@BodyParam("id") id: number) {
        return id;
    }
}

const app = ServerHelper.simpleServer();
const routes = MVCContainer.getRoutes();
routes.forEach(item => app.use(item.baseRoute, item.router));
app.listen(4444);
