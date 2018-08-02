
export interface Klass<T = any> {
    new (...args): T;
    name: string;
}


