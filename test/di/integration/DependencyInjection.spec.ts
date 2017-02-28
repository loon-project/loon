import "../../TestHelper";
import {Component, Inject} from "../../../src/index";
import {DIException} from "../../../src/di/error/DIException";
import {TypedDependencyRegistry} from "../../../src/di/TypedDependencyRegistry";


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
        const aClass = TypedDependencyRegistry.get(AClass);
        aClass.aParamComponent.name().should.be.equal('name');
    });

    it('should have injected properties', () => {
        const aClass = TypedDependencyRegistry.get(AClass);
        aClass.aPropertyComponent.name().should.be.equal('name');
    });

    it('should throw DIException error when constructor param non-injected', () => {
        (() => TypedDependencyRegistry.get(NoSuchParamInjectComponent)).should.throw(DIException);
    });

    it("should throw DIException error when there's no such component", () => {
        (() => TypedDependencyRegistry.get(NoSuchComponent)).should.throw(DIException);
    });
});