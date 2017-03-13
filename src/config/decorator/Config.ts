import {ConfigContainer} from "../ConfigContainer";
import {DIContainer} from "../../di/DIContainer";
import * as Path from "path";
import {ConfigException} from "../error/ConfigException";
import {Reflection} from "../../core/Reflection";

/**
 * Config decorator expect a file name under process.cwd() + "config"
 * @param fileNameOrPath
 * @returns {(target:Function)=>undefined}
 * @constructor
 */
export function Config(fileNameOrPath: string) {

    let path;

    if (Path.isAbsolute(fileNameOrPath)) {
        path = fileNameOrPath;
    } else {
        path = Path.resolve(process.cwd(), "config", fileNameOrPath);
    }


    return (target: Function) => {

        if (Path.extname(fileNameOrPath) !== '.json') {
            throw new ConfigException(`[TYPED] only support json config file`);
        }

        const params = Reflection.getParams(target);
        DIContainer.registerComponent(undefined, target, params);
        ConfigContainer.registerConfig(path);
    };
}