import "../TestHelper";
import {expect} from 'chai';
import {EventEmitter} from "events";
import {Service} from "../../src/mvc/decorator/Service";
import {On} from "../../src/event/decorator/On";
import {DependencyRegistry} from "../../src/di/DependencyRegistry";
import {Inject} from "../../src/di/decorator/Inject";
import {Subscriber} from "../../src/event/decorator/Subscriber";



describe('Event', () => {

    @Service()
    class CustomEventEmitter extends EventEmitter {
    }

    @Service()
    class AServiceTestClass {
        public name = "123";
    }


    @Subscriber()
    class ATestEventClass {

        @Inject()
        private aServiceTestClass: AServiceTestClass;

        @On('aNewEvent', CustomEventEmitter)
        public aEventHandler(message: string) {
            expect(this.aServiceTestClass.name).to.be.equal('123');
        }

        @On('aNewEvent', CustomEventEmitter)
        public anotherEventHandler(message: string) {
            expect(message).to.be.equal('fff');
        }
    }

    it('On function should be triggered for event', () => {
        const emitter = DependencyRegistry.get(CustomEventEmitter);
        emitter.emit('aNewEvent', 'fff');
    });
});