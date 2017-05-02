import "../TestHelper";
import {Initialize} from "../../src/initializer/decorator/Initialize";
import {IInitializer} from "../../src/initializer/interface/IInitializer";
import {InitializerRegistry} from "../../src/initializer/InitializerRegistry";
import {expect} from 'chai';

describe("InitializerRegistry", () => {

    @Initialize()
    class ATestInitializerClass implements IInitializer {

        public init() {
        }
    }

    it('should successfully register a initializer class', () => {

        const initializer: any = InitializerRegistry.initializers.get(ATestInitializerClass);

        expect(initializer).to.be.not.undefined;
        expect(initializer.type).to.be.equal(ATestInitializerClass);
    });
});
