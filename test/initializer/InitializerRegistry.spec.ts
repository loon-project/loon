import "../TestHelper";
import {Initialize} from "../../src/initializer/decorator/Initialize";
import {IInitializer} from "../../src/initializer/interface/IInitializer";
import {InitializerRegistry} from "../../src/initializer/InitializerRegistry";

describe("InitializerRegistry", () => {

    @Initialize()
    class ATestInitializerClass implements IInitializer {

        public init() {
        }
    }

    it('should successfully register a initializer class', () => {

        const initializer: any = InitializerRegistry.initializers.get(ATestInitializerClass);

        initializer.should.not.be.undefined;
        initializer.type.should.be.equal(ATestInitializerClass);
    });
});
