export class DataContainer {

    private static columns: {type: Function, columnName: string, propertyName: string}[] = [];
    private static tables: {type: Function, tableName: string}[] = [];

    public static registerColumn(type: Function, columnName: string, propertyName: string) {
        this.columns.push({type, columnName, propertyName});
    }

    public static registerTable(type: Function, tableName: string) {
        this.tables.push({type, tableName});
    }

    public static getTableName(type: any) {
        const table = this.tables.find(item => item.type === type);
        if (typeof table !== 'undefined') {
            return table.tableName;
        } else {
            throw new Error("[TYPED] => load table error");
        }
    }

    public static getColumnsName(type: any) {
        this.columns
            .filter(item => item.type === type)
            .map(column => {

            });
    }

    public static getColumns(type: any) {
        return this.columns
            .filter(item => item.type === type);
    }
}