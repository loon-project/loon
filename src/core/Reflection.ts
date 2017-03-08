import {Klass} from "./Klass";

export class Reflection {

    public static getType(klass: Klass, key?: string) {
        return (<any> Reflect).getMetadata("design:type", klass, key);
    }

    public static getParams(prototype: any, key?: string): any[] {
        return (<any> Reflect).getMetadata("design:paramtypes", prototype, key);
    }

}