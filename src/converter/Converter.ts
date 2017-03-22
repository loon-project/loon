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

    private _returnType: Function;

    private _template: ConvertTemplate;

    private _silent: boolean;

    private _validate: boolean;

    constructor(options?: ConvertOptions) {

        this._silent = true;
        this._validate = false;

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

    public convert(from: any) {

        const result = this._returnType ? new (<Klass> this._returnType)() : {};

        const defaultTemplate = {};
        Object.keys(from).forEach(key => defaultTemplate[key] = key);
        const template = Object.assign({}, defaultTemplate, this._template);


        Object.keys(template).forEach(key => {
            const targetKey = template[key];
            const targetValue = from[key];

            result[targetKey] = targetValue;
        });

        return result;
    }
}

