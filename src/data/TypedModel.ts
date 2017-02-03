import {DataContainer} from "./DataContainer";

export class TypedModel {

    public static table(): string|undefined {
        return DataContainer.getTableName(this);
    }

    public static modelColumns(): any[] {
        return DataContainer.getColumns(this);
    }

    public static columns(): string[] {
        return this.modelColumns().map(item => `${this.table()}.${item.columnName}`);
    }

    public static column(property: string): string|undefined {
        const modelColumn = this.modelColumns().find(item => item.propertyName === property);
        if (typeof modelColumn !== 'undefined') {
            return `${this.table()}.${modelColumn.columnName}`;
        }
    }

    public static fromDB<T extends TypedModel>(data: any): T {

        const instance = <T>new TypedModel();

        for (let column in data) {
            if (data.hasOwnProperty(column)) {
                const value = data[column];
                const columnName = column.split(`${this.table()}.`)[1];
                const modelColumn = this.modelColumns().find(item => item.columnName === columnName);
                instance[modelColumn.property] = value;
            }
        }

        return instance;


    }
}