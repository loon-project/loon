import {DependencyRegistry} from "../../di/DependencyRegistry";
import {EventListenerRegistry} from "../EventListenerRegistry";
import {Klass} from "../../core/Klass";

export function Subscriber() {
    return (target: Klass) => {
        DependencyRegistry.registerComponent(target);
        EventListenerRegistry.registerListeners(target);
    };
}