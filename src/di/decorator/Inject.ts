import {Container} from "../Container";
import {isTypeSimple} from "../../util/Util";

export function Inject(nameOrValue?: any) {

    return (target: any, key: string, index?: number) => {

        if (typeof index !== 'undefined') {

            const params = (<any> Reflect).getMetadata("design:paramtypes", target, key);
            const type = params[index];

            Container.registerParamHandler({
                type: target,
                index,
                getValue: getValue(type, nameOrValue)
            });

        } else {

            const type = (<any> Reflect).getMetadata("design:type", target, key);

            Container.registerPropertyHandler({
                type: target.constructor,
                key,
                getValue: getValue(type, nameOrValue)
            });
        }
    };
}

function getValue(type: Function, nameOrValue?: any): () => any {
    if (isTypeSimple(type)) {
        return () => nameOrValue;
    } else {
        return () => nameOrValue ? Container.get(nameOrValue) : Container.get(type);
    }
}
