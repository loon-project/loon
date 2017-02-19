
export class Pagable {

    private page: number;
    private size: number;

    constructor(page: number, size?: number) {

        this.page = page;

        if (size) {
            this.size = size;
        } else {
            this.size = 10;
        }

    }
}