import {Klass} from "../core/Klass";
import {DIException} from "./error/DIException";
import {Component} from "../core/Component";
import {Reflection} from "../core/Reflection";

export class DependencyRegistry {

    public static components: Map<Klass, Component> = new Map();
    public static instances: Map<Klass, any> = new Map();

    public static set(klass: Klass, instance: any) {
        this.instances.set(klass, instance);
    }

    public static delete(klass: Klass) {
        this.instances.delete(klass);
    }

    public static has(klass: Klass) {
        return !!this.instances.get(klass);
    }

    public static init(klass: Klass) {
        let params;
        const component = this.components.get(klass);

        if (!component) {
            throw new DIException(`[TYPED] can not find component: ${klass.name}`);
        }

        if (component.params && component.params.length > 0) {
            params = component.params.map((param, index) => {
                const handler = component.paramHandlers.get(index);
                if (handler) {
                    return handler();
                }
                return DependencyRegistry.get(param);
            });
            params.unshift(null);
        }

        component.propertyHandlers.forEach((handler, key) => {
            Object.defineProperty(klass.prototype, key, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: handler()
            });
        });

        const instance = new (klass.bind.apply(klass, params))();
        DependencyRegistry.set(klass, instance);
        return instance;
    }

    public static get(klass: Klass) {
        const instance = this.instances.get(klass);

        if (instance) {
            return instance;
        } else {
            return this.init(klass);
        }
    }

    public static registerComponent(klass: Klass, lazyInit?: boolean) {

        let component = this.components.get(klass);

        if (typeof component === 'undefined') {
            component = new Component(klass);
        }

        const params = Reflection.getParams(klass);
        component.params = params;
        this.components.set(klass, component);
    }

    public static registerHandler(target: any, key: string, index?: number) {

        const klass = target.constructor;

        let component = this.components.get(klass);

        if (typeof component === 'undefined') {
            component = new Component(klass);
            this.components.set(klass, component);
        }

        if (typeof index !== 'undefined') {

            const params = Reflection.getParams(target, key);
            const paramKlass = params[index];
            component.paramHandlers.set(index, () => DependencyRegistry.get(paramKlass));

        } else {

            const klass = Reflection.getType(target, key);
            component.propertyHandlers.set(key, () => DependencyRegistry.get(klass));
        }
    }

    public static unregisterComponent(klass: Klass) {
        this.components.delete(klass);
    }
}