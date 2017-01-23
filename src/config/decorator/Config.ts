import {ConfigContainer} from "../ConfigContainer";
import {Metadata} from "../../metadata/Metadata";
import {DIContainer} from "../../di/DIContainer";
import * as Path from "path";

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
            throw new Error('[Typed framework] only support json config file');
        }

        const params = Metadata.getParams(target);
        DIContainer.registerComponent(undefined, target, params);
        ConfigContainer.registerConfig(path);
    };
}