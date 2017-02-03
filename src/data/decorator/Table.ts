import {DataContainer} from "../DataContainer";

export function Table(tableName: string) {
    return (target: Function) => {
        DataContainer.registerTable(target, tableName);
    };
}