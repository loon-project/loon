import {DIContainer} from "../../di/DIContainer";
import {isTypeSimple} from "../../util/Util";
import {ConfigContainer} from "../ConfigContainer";
import {ConfigOption} from "../interface/ConfigOption";
import {ConfigException} from "../error/ConfigException";

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
    if (isTypeSimple(type)) {
        return () => ConfigContainer.get(expression);
    } else {
        throw new ConfigException(`[TYPED] Value decorator don't support type ${type}`);
    }
}
