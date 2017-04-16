import * as Chakram from "chakram";

export interface RequestOption {
    body?: any;
    headers?: any;
    qs?: any;
}

export class HttpHelper {

    public static sendRequest(httpMethod: string, url: string, options: RequestOption|undefined, assertion: (response) => any) {

        return Chakram.request(httpMethod, url, options).then((data) => {
            const response = data.response;
            assertion(response);
        });
    }
}