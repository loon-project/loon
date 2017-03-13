import {FilterOptions} from "../FilterOptions";
import {FilterRegistry} from "../FilterRegistry";
import {ControllerRegistry} from "../ControllerRegistry";
import {BeforeAfterFilterType} from "../enum/BeforeAfterFilterType";

export function Filter() {
    return (target: any) => {
        FilterRegistry.registerFilter(target);
    };
}

export function BeforeFilter(type: Function, options?: FilterOptions) {
    return (target: any) => {
        ControllerRegistry.registerFilter(target, type, BeforeAfterFilterType.BeforeFilter, options);
    };
}

export function AfterFilter(type: Function, options?: FilterOptions) {
    return (target: any) => {
        ControllerRegistry.registerFilter(target, type, BeforeAfterFilterType.AfterFilter, options);
    };
}