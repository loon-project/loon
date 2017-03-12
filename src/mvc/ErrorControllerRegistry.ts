import {ErrorControllerMetadata} from "./ErrorControllerMetadata";
import {DependencyRegistry} from "../di/DependencyRegistry";
import {Klass} from "../core/Klass";
import {HandlerRegistry} from "./HandlerRegistry";

export class ErrorControllerRegistry {

    private static _errorControllers: Map<Function, ErrorControllerMetadata> = new Map();

    public static errorControllers = ErrorControllerRegistry._errorControllers;

    public static registerErrorController(type: Function, baseUrl: string) {

        DependencyRegistry.registerComponent(<Klass>type);

        const errorErrorController = this.getErrorController(type);
        const handlerMetadata = HandlerRegistry.getHandler(type, 'use');

        handlerMetadata.isErrorHandler = true;
        errorErrorController.baseUrl = baseUrl;
        errorErrorController.handler = handlerMetadata;
    }

    private static getErrorController(type: Function) {

        let errorControllerMetadata = this._errorControllers.get(type);

        if (typeof errorControllerMetadata === 'undefined') {

            errorControllerMetadata = new ErrorControllerMetadata(type);
            this._errorControllers.set(type, errorControllerMetadata);
        }

        return errorControllerMetadata;
    }
}
