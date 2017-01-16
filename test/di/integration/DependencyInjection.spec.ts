import "../../TestHelper";
import {Component} from "../../../src/di/decorator/Component";
import {Inject} from "../../../src/di/decorator/Inject";
import {Container} from "../../../src/di/Container";


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
        const aClass = Container.get(AClass);
        aClass.aParamComponent.name().should.be.equal('name');
        aClass.str.should.be.equal('aaa');
    });

    it('should have injected properties', () => {
        const aClass = Container.get(AClass);
        aClass.aParamComponent.name().should.be.equal('name');
        aClass.num.should.be.equal(777);
    });

});