import {ConvertTemplate} from "./ConvertTemplate";
import {ConvertOptions} from "./ConvertOptions";
import {Klass} from "../core/Klass";

/**
 *
 * Converter is used to convert data to another data format.
 *
 * Supporting following use case:
 *
 *  convert js object to a class instance
 *  convert a class instance to an object
 *  convert an object to another object
 *
 *
 */
export class Converter {

    private _from: any;

    private _returnType: Function;

    private _template: ConvertTemplate;

    private _silent: boolean;

    private _validate: boolean;

    constructor(from: any, options?: ConvertOptions) {

        this._from = from;

        this.initializeDefault();

        if (options) {

            if (typeof options.returnType !== 'undefined') {
                this._returnType = options.returnType;
            }

            if (typeof options.silent !== 'undefined') {
                this._silent = options.silent;
            }

            if (typeof options.validate !== 'undefined') {
                this._validate = options.validate;
            }

            if (typeof options.template !== 'undefined') {
                this._template = Object.assign({}, this._template, options.template);
            }

        }

    }

    public use(template: ConvertTemplate) {
        this._template = template;
        return this;
    }

    public convert() {

        const result = this._returnType ? new (<Klass> this._returnType)() : {};

        Object.keys(this._template).forEach(key => {
            const targetKey = this._template[key];
            const targetValue = this._from[key];

            result[targetKey] = targetValue;
        });

        return result;
    }

    private initializeDefault() {
        this._silent = true;
        this._validate = false;

        const defaultTemplate = {};
        Object.keys(this._from).forEach(key => defaultTemplate[key] = key);
        this._template = defaultTemplate;
    }
}

