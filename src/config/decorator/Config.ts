import {ConfigContainer} from "../ConfigContainer";
import {Metadata} from "../../metadata/Metadata";
import {DIContainer} from "../../di/DIContainer";
import * as Path from "path";

export function Config(path: string) {

    return (target: Function) => {

        if (Path.extname(path) !== '.json') {
            throw new Error('[Typed framework] only support json config file');
        }

        const params = Metadata.getParams(target);
        DIContainer.registerComponent(undefined, target, params);
        ConfigContainer.registerConfig(path);
    };
}