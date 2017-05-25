import {EventEmitter} from "events";
import {EventListenerRegistry} from "../EventListenerRegistry";

export function On(eventName: string, eventEmitterKlass: any) {

    return (target: any, key: string, descriptor) => {
        const handler = descriptor.value;
        EventListenerRegistry.registerEventListener(target.constructor, key, eventName, eventEmitterKlass, handler);
    };

}