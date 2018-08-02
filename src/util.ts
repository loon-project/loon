
export function isSimpleType(type: Function): boolean {
    return ["string", "boolean", "number", "object", "date"].indexOf(type.name.toLowerCase()) !== -1;
}

export function convertArrayToMap(data: any[]): Map<number, any> {
    const ret = new Map<number, any>();

    data.forEach((item, index) => {
        ret.set(index, item);
    });

    return ret;
}
