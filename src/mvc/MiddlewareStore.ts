import {MiddlewareMetadata} from "./MiddlewareMetadata";

export class MiddlewareStore {

    private _beforeActions: MiddlewareMetadata[];

    private _afterActions: MiddlewareMetadata[];

    get beforeActions(): MiddlewareMetadata[] {
        return this._beforeActions;
    }

    get afterActions(): MiddlewareMetadata[] {
        return this._afterActions;
    }

    set beforeActions(value: MiddlewareMetadata[]) {
        this._beforeActions = value;
    }

    set afterActions(value: MiddlewareMetadata[]) {
        this._afterActions = value;
    }

    constructor() {
        this._beforeActions = [];
        this._afterActions = [];
    }
}