import "../../TestHelper";
import {Component} from "../../../src/di/decorator/Component";
import {Inject} from "../../../src/di/decorator/Inject";
import {DIContainer} from "../../../src/di/DIContainer";


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

        @Inject(777)
        public num: number;

        constructor(public aParamComponent: AComponent, @Inject("aaa") public str: string) {
        }
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

});