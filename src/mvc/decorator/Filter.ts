import {FilterOptions} from "../FilterOptions";
import {FilterRegistry} from "../FilterRegistry";
import {ControllerRegistry} from "../ControllerRegistry";
import {BeforeAfterFilterType} from "../enum/BeforeAfterFilterType";
import { Klass } from "../../core";

export function Filter() {
    return (target: Klass) => {
        FilterRegistry.registerFilter(target);
    };
}

export function BeforeFilter(type: Klass, options?: FilterOptions) {
    return (target: any) => {
        ControllerRegistry.registerFilter(target, type, BeforeAfterFilterType.BeforeFilter, options);
    };
}

export function AfterFilter(type: Klass, options?: FilterOptions) {
    return (target: any) => {
        ControllerRegistry.registerFilter(target, type, BeforeAfterFilterType.AfterFilter, options);
    };
}