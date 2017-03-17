
export abstract class HttpException extends Error {

    public status: number;

    public code: string;

}