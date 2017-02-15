import {TypedApplicationOption} from "./TypedApplicationOption";

export class ServerContainer {

    public static application: Function;
    public static options: TypedApplicationOption;

    public static registerApplication(klass: Function, options?: TypedApplicationOption) {
        this.application = klass;
        this.options = options ? options : {};
    }
}