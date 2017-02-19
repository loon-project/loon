
export class Pagable {

    private _page: number;
    private _size: number;

    constructor(page: number, size?: number) {

        this._page = page;

        if (size) {
            this._size = size;
        } else {
            this._size = 10;
        }

    }

    public readonly page = this._page;
    public readonly size = this._size;
}