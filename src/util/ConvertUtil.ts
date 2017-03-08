
export class ConvertUtil {

    public static convertArrayToMap(data: any[]): Map<number, any> {
        const ret = new Map<number, any>();

        data.forEach((item, index) => {
            ret.set(index, item);
        });

        return ret;
    }

}
