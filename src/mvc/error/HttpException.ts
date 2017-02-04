
export abstract class HttpException {

    public code: number;

    public message: string;

    public stack: string;

    private err: Error;

    constructor() {
        this.err = new Error();
        this.stack = this.err.stack ? this.err.stack : "";
    }
}