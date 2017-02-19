import {Entity} from "./Entity";

export class EntityManager {

    public static getEntity(model: any) {
        return new Entity(model);
    }
}

class User {

}


const userEntity = EntityManager.getEntity(User);


