import "../TestHelper";
import {RestController} from "../../src/mvc/decorator/Controller";
import {Get} from "../../src/mvc/decorator/Method";
import {ControllerRegistry} from "../../src/mvc/ControllerRegistry";
import {ControllerTransformer} from "../../src/mvc/ControllerTransformer";
import * as Express from 'express';
import {expect} from 'chai';

describe('ControllerTransformer', () => {

    @RestController("/abc")
    class ATestRestControllerForControllerTransformerClass {

        @Get("/")
        public indexAction() {
        }
    }

    it('should convert to router', () => {
        const controllerMetadata: any = ControllerRegistry.controllers.get(ATestRestControllerForControllerTransformerClass);
        const transformer = new ControllerTransformer(controllerMetadata);

        expect(transformer.controllerMetadata).to.be.equal(controllerMetadata);
        expect(transformer.transform().name).to.be.equal(Express.Router().name);
    });
});