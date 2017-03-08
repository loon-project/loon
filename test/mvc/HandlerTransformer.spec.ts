import "../TestHelper";
import {RestController} from "../../src/mvc/decorator/Controller";
import {Get} from "../../src/mvc/decorator/Method";

describe('HandlerTransformer', () => {

    @RestController()
    class ATestRestControllerClass {

        @Get("/")
        public indexAction() {
        }
    }





});