import {ErrorControllerRegistry} from "../ErrorControllerRegistry";

export function ErrorController(baseUrl?: string) {
    return (target: any) => {
        ErrorControllerRegistry.registerErrorController(target, baseUrl ? baseUrl : "");
    };
}