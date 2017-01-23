import {PropertyHandler, ParamHandler} from "./Handler";
import {Component} from "./Component";
import {DIException} from "./error/DIException";

export class DIContainer {

    private static instances: { name: string|undefined, type: Function|undefined, instance: any }[] = [];
    private static components: Component[] = [];
    private static paramHandlers: ParamHandler[] = [];
    private static propertyHandlers: PropertyHandler[] = [];

    public static registerComponent(name: string|undefined, type: Function, params: any) {
        this.components.push({
            name,
            type,
            params
        });
    }

    public static registerParamHandler(handler: ParamHandler) {
        this.paramHandlers.push(handler);
    }

    public static registerPropertyHandler(handler: PropertyHandler) {
        this.propertyHandlers.push(handler);
    }

    // public static unregisterComponent(name: string|undefined, type: Function) {
    //     this.components = this.components.filter(item => item.name !== name && item.type !== type);
    // }
    //
    // public static set(nameOrType: Function|string, value: any) {
    //
    //     if (this.findInstanceByNameOrType(nameOrType)) {
    //         throw new DIException('[Typed] can not find instance');
    //     }
    //
    //     if (typeof nameOrType === "string") {
    //
    //         this.instances.push({
    //             name: nameOrType,
    //             type: undefined,
    //             instance: value
    //         });
    //
    //     } else {
    //
    //         this.instances.push({
    //             name: undefined,
    //             type: nameOrType,
    //             instance: value
    //         });
    //     }
    // }

    public static get(nameOrType: string|Function): any {

        let instance = this.findInstanceByNameOrType(nameOrType);

        if (instance) {
            return instance;
        }

        const component = this.findComponentByNameOrType(nameOrType);

        const name = component.name;
        const type = component.type;
        let params  = component.params;


        if (params) {
            params = this.initParams(type, params);
            params.unshift(null);
        }

        instance = new (type.bind.apply(type, params))();
        this.instances.push({name, type, instance});
        this.applyProperties(type);
        return instance;
    }

    public static clear() {
        this.instances = [];
        this.components = [];
    }

    private static initParams(type: Function, params: any): any[] {
        return params.map((param, index) => {
            const handler = this.paramHandlers.find(item => item.type === type && item.index === index);

            if (handler) {
                return handler.getValue();
            }

            return DIContainer.get(param);
        });
    }

    private static applyProperties(type: Function) {
        this.propertyHandlers
            .filter(handler => handler.type === type)
            .map(item => {

                Object.defineProperty(type.prototype, item.key,
                    {
                        configurable: true,
                        enumerable: true,
                        writable: true,
                        value: item.getValue()
                    }
                );
            });
    }

    private static findInstanceByName(name: string) {
        const instanceItem = this.instances.find(item => item.name === name);
        if (instanceItem) {
            return instanceItem.instance;
        }
    }

    private static findInstanceByType(type: Function) {
        const instanceItem = this.instances.find(item => item.type === type);
        if (instanceItem) {
            return instanceItem.instance;
        }
    }

    private static findInstanceByNameOrType(nameOrType: string|Function) {
        if (typeof nameOrType === 'string') {
            return this.findInstanceByName(nameOrType);
        } else {
            return this.findInstanceByType(nameOrType);
        }
    }

    private static findComponentByName(name: string) {
        const component = this.components.find(item => item.name === name);
        if (component) {
            return component;
        } else {
            throw new DIException(`[TYPED] can not find component by name ${name}`);
        }
    }

    private static findComponentByType(type: Function) {
        const component = this.components.find(item => item.type === type);
        if (component) {
            return component;
        } else {
            throw new DIException(`[TYPED] can not find component by type ${type}`);
        }
    }

    private static findComponentByNameOrType(nameOrType: string|Function) {
        if (typeof nameOrType === "string") {
            return this.findComponentByName(nameOrType);
        } else {
            return this.findComponentByType(nameOrType);
        }
    }
}