import {TypedApplicationOption} from "./TypedApplicationOption";

export class ServerContainer {

    public static application: Function;

    public static options: TypedApplicationOption;

    public static registerApplication(target: Function, options?: TypedApplicationOption) {
        this.application = target;
        this.options = options ? options : {};
    }

}