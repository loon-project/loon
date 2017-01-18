
export interface ActionMetadata {

    type: Function;

    httpMethod: string;

    route: string | RegExp;

    actionName: string;

    params: Function[];

}