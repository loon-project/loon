export interface IParamOptions {
    required?: boolean;
    parseJson?: boolean;
}

export function PathParam(name?: string) {
    return (target: any, key: string, index: number) => {
        console.log(`PathParam: ${key} ${index}`);
    };
}

export function QueryParam(name?: string) {
    return (target: any, key: string, index: number) => {
        console.log(`QueryParam: ${key} ${index}`);
    };
}

export function BodyParam(name?: string) {
    return (target: any, key: string, index: number) => {
        console.log(`BodyParam: ${key} ${index}`);
    };
}

export function HeaderParam(name?: string) {
    return (target: any, key: string, index: number) => {
        console.log(`HeaderParam: ${key} ${index}`);
    };
}

export function CookieParam(name?: string) {
    return (target: any, key: string, index: number) => {
        console.log(`CookieParam: ${key} ${index}`);
    };
}

