import {JsonPropertyMetadata} from "./JsonPropertyMetadata";

export class JsonSourceMetadata {

    private _properties: Map<string, JsonPropertyMetadata> = new Map();

    public properties = this._properties;

}