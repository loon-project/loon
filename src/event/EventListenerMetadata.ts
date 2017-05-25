import {Klass} from "../core/Klass";
import {EventEmitter} from "events";

export class EventListenerMetadata {

    public klass: Klass;

    public method: string;

    public eventName: string;

    public emitterKlass: new (...args) => EventEmitter;

    public handler: (...args) => any;

}
