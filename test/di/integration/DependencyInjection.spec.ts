import "../../TestHelper";
import {Component, Inject} from "../../../src/index";
import {DIContainer} from "../../../src/di/DIContainer";
import {DIException} from "../../../src/di/error/DIException";


describe('Dependency Injection', () => {

    @Component()
    class AComponent {

        public name() {
            return "name";
        }
    }

    @Component("a-named-component")
    class ATestNamedComponent {

        public name() {
            return "a named component";
        }
    }

    @Component()
    class AClass {

        @Inject()
        public aPropertyComponent: AComponent;

        @Inject("a-named-component")
        public aTestNamedPropertyComponent: ATestNamedComponent;

        @Inject(777)
        public num: number;

        constructor(public aParamComponent: AComponent, @Inject("aaa") public str: string) {
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
        const aClass = DIContainer.get(AClass);
        aClass.aParamComponent.name().should.be.equal('name');
        aClass.str.should.be.equal('aaa');
    });

    it('should have injected properties', () => {
        const aClass = DIContainer.get(AClass);
        aClass.aParamComponent.name().should.be.equal('name');
        aClass.num.should.be.equal(777);
    });

    it('should have injected named component properties', () => {
        const aClass = DIContainer.get(AClass);
        aClass.aTestNamedPropertyComponent.name().should.be.equal('a named component');
    });

    it('should have injected type component properties', () => {
        const aClass = DIContainer.get(AClass);
        aClass.aPropertyComponent.name().should.be.equal('name');
    });

    it('should throw DIException error when constructor param non-injected', () => {
        (() => DIContainer.get(NoSuchParamInjectComponent)).should.throw(DIException);
    });

    it("should throw DIException error when there's no such component", () => {
        (() => DIContainer.get(NoSuchComponent)).should.throw(DIException);
    });

    it("should throw DIException error when there's no such component name", () => {
        (() => DIContainer.get("no-such-component")).should.throw(DIException);
    });
});