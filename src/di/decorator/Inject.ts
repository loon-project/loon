import {DIContainer} from "../DIContainer";
import {isTypeSimple} from "../../util/Util";

export function Inject(nameOrValue?: any) {

    return (target: any, key: string, index?: number) => {

        if (typeof index !== 'undefined') {

            const params = (<any> Reflect).getMetadata("design:paramtypes", target, key);
            const type = params[index];

            DIContainer.registerParamHandler({
                type: target,
                index,
                getValue: getValue(type, nameOrValue)
            });

        } else {

            const type = (<any> Reflect).getMetadata("design:type", target, key);

            DIContainer.registerPropertyHandler({
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
        return () => nameOrValue ? DIContainer.get(nameOrValue) : DIContainer.get(type);
    }
}
