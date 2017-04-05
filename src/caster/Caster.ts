import {TypeUtil} from "../util/TypeUtil";

export class Caster {

    public static cast(value: any, returnType: Function) {

        try {
            if (TypeUtil.isSimpleType(returnType)) {

                switch (returnType.name) {

                    case "String":
                        return value.toString();

                    case "Boolean":
                        if (value === 'true') {
                            return true;
                        } else if (value === 'false') {
                            return false;
                        } else {
                            throw new Error(`[TYPED] cast ${value} to boolean error`);
                        }

                    case "Number":
                        return parseInt(value, 10);

                    case "Object":
                        return value;

                }

            } else {
                throw new Error(`[TYPED] not support cast to type: ${returnType.name}`);
            }

        } catch (e) {
            return value;
        }

    }

}