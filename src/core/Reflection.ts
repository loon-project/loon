export class Reflection {

    public static getType(type: any, key?: string) {
        return (<any> Reflect).getMetadata("design:type", type, key);
    }

    public static getParams(prototype: any, key?: string): any[] {
        return (<any> Reflect).getMetadata("design:paramtypes", prototype, key);
    }

}