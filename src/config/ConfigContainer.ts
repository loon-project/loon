import * as _ from "lodash";

export class ConfigContainer {

    private static configFiles: string[] = [];
    private static config: any;


    public static registerConfig(path: string) {
        this.configFiles.push(path);

        try {
            const config = require(path);
            this.config = _.merge({}, this.config, config);
        } catch (err) {
            console.log('[Typed framework] load config file error');
        }
    }

    public static get(expression: string) {
        return _.get(this.config, expression);
    }
}