
export interface ParamHandler {
    type: Function;
    index: number;
    getValue: () => any;
}

export interface PropertyHandler {
    type: Function;
    key: string;
    getValue: () => any;
}