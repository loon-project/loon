import "../TestHelper";
import {RestController} from "../../src/mvc/decorator/Controller";
import {Get} from "../../src/mvc/decorator/Method";
import {ControllerRegistry} from "../../src/mvc/ControllerRegistry";
import {ControllerTransformer} from "../../src/mvc/ControllerTransformer";
import * as Express from 'express';

describe('ControllerTransformer', () => {

    @RestController("/abc")
    class ATestRestControllerForControllerTransformerClass {

        @Get("/")
        public indexAction() {
        }
    }

    it('should convert to router', () => {
        const controllerMetadata: any = ControllerRegistry.controllers.get(ATestRestControllerForControllerTransformerClass);
        controllerMetadata.should.not.be.undefined;

        const transformer = new ControllerTransformer(controllerMetadata);
        transformer.controllerMetadata.should.be.equal(controllerMetadata);
        transformer.transform().name.should.be.equal(Express.Router().name);
    });
});