import {Container} from "../Container";

export function Component(name?: string) {
    return (target: Function) => {
        const params = (<any> Reflect).getMetadata("design:paramtypes", target);
        Container.registerComponent(name, target, params);
    };
}