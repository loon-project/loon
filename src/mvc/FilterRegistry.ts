import {FilterMetadata} from "./FilterMetadata";
import {DependencyRegistry} from "../di/DependencyRegistry";
import {Klass} from "../core/Klass";
import {HandlerRegistry} from "./HandlerRegistry";

export class FilterRegistry {

    private static _filters: Map<Function, FilterMetadata> = new Map();

    public static filters = FilterRegistry._filters;

    public static registerFilter(type: Function) {

        DependencyRegistry.registerComponent(<Klass>type);
        const filterMetadata = this.getFilter(type);

        const handlerMetadata = HandlerRegistry.getHandler(type, 'use');
        filterMetadata.handler = handlerMetadata;
    }

    public static getFilter(type: Function) {

        let filterMetadata = this._filters.get(type);

        if (typeof filterMetadata === 'undefined') {
            filterMetadata = new FilterMetadata(type);
            this._filters.set(type, filterMetadata);
        }

        return filterMetadata;
    }

}