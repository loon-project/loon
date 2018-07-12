import {Klass} from "../core/Klass";
import {EventEmitter} from "events";
import {EventListenerMetadata} from "./EventListenerMetadata";
import {DependencyRegistry} from "../di/DependencyRegistry";

export class EventListenerRegistry {

    private static _listeners: Map<Function, EventListenerMetadata[]> = new Map();

    public static registerListeners(klass: Klass) {

        const listeners = this._listeners.get(klass);

        if (typeof listeners !== 'undefined') {

            listeners.forEach(listener => {
                const emitter = DependencyRegistry.get(listener.emitterKlass);
                const subscriber = DependencyRegistry.get(listener.klass);
                emitter.on(listener.eventName, listener.handler.bind(subscriber));
            });
        }
    }

    public static registerEventListener(klass: Klass,
                                        method: string,
                                        eventName: string,
                                        emitterKlass: new (...args) => EventEmitter,
                                        handler: (...args) => any) {

        const listenerMetadata = new EventListenerMetadata();

        listenerMetadata.klass = klass;
        listenerMetadata.method = method;
        listenerMetadata.eventName = eventName;
        listenerMetadata.emitterKlass = emitterKlass;
        listenerMetadata.handler = handler;

        let listeners = this._listeners.get(klass);

        if (typeof listeners === 'undefined') {
            listeners = [listenerMetadata];
        } else {
            listeners.push(listenerMetadata);
        }

        this._listeners.set(klass, listeners);
    }
}