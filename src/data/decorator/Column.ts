import {DataContainer} from "../DataContainer";

export function Column(columnName?: string) {
    return (target: any, propertyName: string) => {
        DataContainer.registerColumn(target.constructor, columnName ? columnName : propertyName, propertyName);
    };
}