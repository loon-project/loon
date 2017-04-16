import {TypeUtil} from "../util/TypeUtil";

export class Caster {

    public static cast(value: any, returnType: Function) {

        try {
            if (TypeUtil.isSimpleType(returnType)) {

                switch (returnType.name) {

                    case "String":

                        return "" + value;

                    case "Boolean":

                        if (value === 'true') return true;
                        if (value === 'false') return false;

                        return !!value;

                    case "Number":
                        return +value;

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