export const ParamTypes = "design:paramtypes";

export class Metadata {

    static getParams(target: Function, key?: string) {
        return (<any> Reflect).getMetadata(ParamTypes, target, key);
    }
}