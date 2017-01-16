import "../../TestHelper";
import {Container} from "../../../src/di/Container";


describe('Container', () => {

    class AComponent {

        public name() {
            return "A Component";
        }
    }

    class AClass {

        public name() {
            return "A Class";
        }

        public num: number;

        public a: AComponent;

        constructor(public aComponent: AComponent, public str: string) {
        }
    }

    beforeEach(() => {
        Container.clear();
    });

    it('should get Class instance', () => {
        Container.registerComponent(undefined, AClass, undefined);
        const aClass = Container.get(AClass);
        aClass.name().should.be.equal("A Class");
    });

    it('should have ability to inject dependency by constructor parameter', () => {

        Container.registerComponent(undefined, AComponent, undefined);
        Container.registerComponent(undefined, AClass, [AComponent,  String]);

        Container.registerParamHandler({
            type: AClass,
            index: 0,
            getValue: () => Container.get(AComponent)
        });

        Container.registerParamHandler({
            type: AClass,
            index: 1,
            getValue: () => "string"
        });

        Container.get(AClass).aComponent.name().should.be.equal("A Component");
        Container.get(AClass).str.should.be.equal("string");
    });

    it('should have ability to inject dependency by property', () => {

        Container.registerComponent(undefined, AComponent, undefined);
        Container.registerComponent(undefined, AClass, undefined);

        Container.registerPropertyHandler({
            type: AClass,
            key: 'num',
            getValue: () => "777"
        });

        Container.registerPropertyHandler({
            type: AClass,
            key: 'a',
            getValue: () => Container.get(AComponent)
        });

        // Container.get(AClass).a.name().should.be.equal("A Component");
        // Container.get(AClass).num.should.be.equal(777);
    });
});
