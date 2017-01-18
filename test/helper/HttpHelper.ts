import * as Chakram from "chakram";

export class HttpHelper {

    public static sendRequest(httpMethod: string, url: string, assertion: (response) => any) {
        return Chakram[httpMethod](url).then((data) => {
            const response = data.response;
            assertion(response);
        });
    }
}