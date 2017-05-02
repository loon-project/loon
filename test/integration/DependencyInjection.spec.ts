import "../TestHelper";
import {Component} from "../../src/di/decorator/Component";
import {Inject} from "../../src/di/decorator/Inject";
import {DependencyRegistry} from "../../src/di/DependencyRegistry";
import {DIException} from "../../src/di/error/DIException";
import {expect} from 'chai';


describe('[Integration] Dependency Injection', () => {

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
        expect(aClass.aParamComponent.name()).to.be.equal('name');
    });

    it('should have injected properties', () => {
        const aClass = DependencyRegistry.get(AClass);
        expect(aClass.aPropertyComponent.name()).to.be.equal('name');
    });

    it('should throw DIException error when constructor param non-injected', () => {
        const fn = () => DependencyRegistry.get(NoSuchParamInjectComponent);
        expect(fn).throw(DIException);
    });

    it("should throw DIException error when there's no such component", () => {
        const fn = () => DependencyRegistry.get(NoSuchComponent);
        expect(fn).throw(DIException);
    });
});