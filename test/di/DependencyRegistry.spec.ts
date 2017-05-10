import "../TestHelper";
import {expect} from 'chai';
import {Component} from "../../src/di/decorator/Component";
import {Inject} from "../../src/di/decorator/Inject";
import {DependencyRegistry} from "../../src/di/DependencyRegistry";


describe("DependencyRegistry", () => {

    @Component()
    class AInjectableComponent {
        public name = "AAA";
    }

    @Component()
    class ASuperTestComponent {

        @Inject()
        public aInjectableComponent: AInjectableComponent;

    }

    @Component()
    class ASubTestComponent {

        @Inject()
        public aSuperTestComponent: ASuperTestComponent;


    }

    it('should successfully inject from super component', () => {

        const aSubComponent = DependencyRegistry.get(ASubTestComponent);

        expect(aSubComponent.aSuperTestComponent.aInjectableComponent.name).to.be.equal("AAA");
    });

});