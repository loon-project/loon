import {Log} from "../logger/index";

export class DataContainer {

    private static columns: {type: Function, columnName: string, propertyName: string}[] = [];
    private static tables: {type: Function, tableName: string}[] = [];

    public static registerColumn(type: Function, columnName: string, propertyName: string) {
        this.columns.push({type, columnName, propertyName});
    }

    public static registerTable(type: Function, tableName: string) {
        this.tables.push({type, tableName});
    }

    public static getTableName(type: Function) {
        const table = this.tables.find(item => item.type === type);
        if (typeof table !== 'undefined') {
            return table.tableName;
        } else {
            throw new Error("[TYPED] => load table error");
        }
    }

    public static getColumnsName(type: Function) {
        this.columns
            .filter(item => item.type === type)
            .map(column => {

            });
    }

    public static getColumns(type: Function) {
        return this.columns
            .filter(item => item.type === type);
    }
}