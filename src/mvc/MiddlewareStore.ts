import {MiddlewareMetadata} from "./MiddlewareMetadata";

export class MiddlewareStore {

    private _beforeActions: MiddlewareMetadata[];

    private _afterActions: MiddlewareMetadata[];

    private _errorActions: MiddlewareMetadata[];

    get beforeActions(): MiddlewareMetadata[] {
        return this._beforeActions;
    }

    get afterActions(): MiddlewareMetadata[] {
        return this._afterActions;
    }

    get errorActions(): MiddlewareMetadata[] {
        return this._errorActions;
    }

    set beforeActions(value: MiddlewareMetadata[]) {
        this._beforeActions = value;
    }

    set afterActions(value: MiddlewareMetadata[]) {
        this._afterActions = value;
    }

    set errorActions(value: MiddlewareMetadata[]) {
        this._errorActions = value;
    }

    constructor() {

        this._beforeActions = [];
        this._afterActions = [];
        this._errorActions = [];
    }
}