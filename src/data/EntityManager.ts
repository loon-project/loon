import {Entity} from "./Entity";
import {Klass} from "../core/Klass";

export class EntityManager {

    public static getEntity(model: Klass) {
        return new Entity(model);
    }
}
