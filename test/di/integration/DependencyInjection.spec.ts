import "../../TestHelper";
import {Component, Inject} from "../../../src/index";
import {DIException} from "../../../src/di/error/DIException";
import {DependencyRegistry} from "../../../src/di/DependencyRegistry";


describe('Dependency Injection', () => {

    @Component()
    class AComponent {

        public name() {
            return "name";
        }
    }

    @Component()
    class AClass {

        @Inject()
        public aPropertyComponent: AComponent;

        constructor(public aParamComponent: AComponent) {
        }
    }

    @Component()
    class NoSuchParamInjectComponent {
        constructor(public unInjectedNum: number) {
        }
    }


    class NoSuchComponent {
    }

    it('should have injected params', () => {
        const aClass = DependencyRegistry.get(AClass);
        aClass.aParamComponent.name().should.be.equal('name');
    });

    it('should have injected properties', () => {
        const aClass = DependencyRegistry.get(AClass);
        aClass.aPropertyComponent.name().should.be.equal('name');
    });

    it('should throw DIException error when constructor param non-injected', () => {
        (() => DependencyRegistry.get(NoSuchParamInjectComponent)).should.throw(DIException);
    });

    it("should throw DIException error when there's no such component", () => {
        (() => DependencyRegistry.get(NoSuchComponent)).should.throw(DIException);
    });
});