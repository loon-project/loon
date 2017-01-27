

export class TypedModel {

    public static table(): string {
        return "";
    }

    public static columns(): string[] {
        return [];
    }

    public static column(property: string): string {
        return "";
    }

    private static columnToPropertyMapping() {
    }

    private static propertyToColumnMapping() {
    }

    public static fromDB<T extends TypedModel>(): T {
        const instance = <T>new TypedModel();

        return instance;
    }
}