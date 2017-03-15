import {InitializerMetadata} from "./InitializerMetadata";
import {DependencyRegistry} from "../di/DependencyRegistry";
import {Klass} from "../core/Klass";

export class InitializerRegistry {

    private static _initializers: Map<Function, InitializerMetadata> = new Map();

    public static initializers = InitializerRegistry._initializers;

    public static registerInitializer(type: Function) {
        DependencyRegistry.registerComponent(<Klass>type);
        this.getInitializer(type);
    }

    public static getInitializers() {

        const result: any[] = [];

        this._initializers.forEach(initializer => result.push(initializer));

        return result;
    }

    public static getInitializer(type: Function) {

        let initializerMetadata = this._initializers.get(type);

        if (typeof initializerMetadata === 'undefined') {
            initializerMetadata = new InitializerMetadata(type);
            this._initializers.set(type, initializerMetadata);
        }

        return initializerMetadata;
    }
}