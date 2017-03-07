
export class TypeUtil {

    public static isSimpleType(type: Function): boolean {
        return ["string", "boolean", "number", "object"].indexOf(type.name.toLowerCase()) !== -1;
    }

}