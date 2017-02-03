import * as _ from "lodash";
import * as Path from 'path';

export class ConfigContainer {

    private static configFiles: string[] = [];
    private static config: any;


    public static registerConfig(path: string) {
        this.configFiles.push(path);

        try {
            const name = Path.parse(path).name;
            const config = require(path);
            this.config = _.merge({}, this.config, {[name]: config});
        } catch (err) {
            console.log(`[TYPED][ERR] ${path} load error`);
        }
    }

    public static get(expression: string) {
        return _.get(this.config, expression);
    }
}