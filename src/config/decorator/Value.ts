import {DIContainer} from "../../di/DIContainer";
import {isTypeSimple} from "../../util/Util";
import {ConfigContainer} from "../ConfigContainer";
import {ConfigOption} from "../interface/ConfigOption";

export function Value(expression: string, options?: ConfigOption) {

    return (target: any, key: string, index?: number) => {

        if (!(options && options.env === false)) {
            const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "development";
            expression = `${NODE_ENV}.${expression}`;
        }

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
        throw new Error("[Typed Framework] Value decorator only support basic type now");
    }
}
