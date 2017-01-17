export const ParamTypes = "design:paramtypes";

export class Metadata {

    static getParams(target: Function) {
        return (<any> Reflect).getMetadata(ParamTypes, target);
    }
}