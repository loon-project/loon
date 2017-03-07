import {DIContainer} from "../../di/DIContainer";
import {ConfigContainer} from "../ConfigContainer";
import {ConfigException} from "../error/ConfigException";
import {TypeUtil} from "../../util/TypeUtil";

export function Value(expression: string) {

    return (target: any, key: string, index?: number) => {

        if (typeof index !== 'undefined') {

            const params = (<any> Reflect).getMetadata("design:paramtypes", target, key);
            const type = params[index];

            DIContainer.registerParamHandler({
                type: target,
                index,
                getValue: getValue(type, expression)
            });

        } else {

            const type = (<any> Reflect).getMetadata("design:type", target, key);

            DIContainer.registerPropertyHandler({
                type: target.constructor,
                key,
                getValue: getValue(type, expression)
            });
        }
    };
}

function getValue(type: Function, expression: string): () => any {
    if (TypeUtil.isSimpleType(type)) {
        return () => ConfigContainer.get(expression);
    } else {
        throw new ConfigException(`[TYPED] Value decorator don't support type ${type}`);
    }
}
