
export class Pagable {

    private pageNumber: number;
    private pageSize: number;

    constructor(pageNumber: number, pageSize?: number) {

        this.pageNumber = pageNumber;

        if (pageSize) {
            this.pageSize = pageSize;
        }

    }
}