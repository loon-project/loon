import {Entity} from "./Entity";
import {Klass} from "../core/Klass";

export class EntityManager {

    public static getEntity<T>(model: Klass<T>) {
        return new Entity(model);
    }
}
