import {SettingOptions} from "../SettingOptions";
import {ApplicationRegistry} from "../ApplicationRegistry";

export function ApplicationSettings(options: SettingOptions) {

    return (target: Function) => {
        ApplicationRegistry.registerWithOptions(options);
    };

}