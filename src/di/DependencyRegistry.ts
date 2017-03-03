import {Klass} from "../core/Klass";
import {DIException} from "./error/DIException";
import {Component} from "../core/Component";
import {Reflection} from "../core/Reflection";
import {Metadata} from "../metadata/Metadata";

export class DependencyRegistry {

    private static components: Map<Klass, Component> = new Map();
    private static instances: Map<Klass, any> = new Map();

    public static set(klass: Klass, instance: any) {
        this.instances.set(klass, instance);
    }

    public static delete(klass: Klass) {
        this.instances.delete(klass);
    }

    public static get(klass: Klass) {
        let instance = this.instances.get(klass);
        let params;

        if (instance) {
            return instance;
        }

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

        instance = new (klass.bind.apply(klass, params))();

        DependencyRegistry.set(klass, instance);

        return instance;
    }

    public static registerComponent(klass: Klass) {

        let component = this.components.get(klass);

        if (typeof component === 'undefined') {
            component = new Component(klass);
        }

        const params = Metadata.getParams(klass);
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

            const params = Metadata.getParams(target, key);
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