import {Klass} from "./Klass";

export class Component {

    public klass: Klass;

    public params: any[];

    public paramHandlers: Map<number, () => any>;

    public propertyHandlers: Map<string, () => any>;

    constructor(klass: Klass) {
        this.klass = klass;
        this.paramHandlers = new Map();
        this.propertyHandlers = new Map();
    }
}