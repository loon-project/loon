import {SettingOptions} from "../interface/SettingOptions";
import {ApplicationRegistry} from "../ApplicationRegistry";

export function ApplicationSettings(options: SettingOptions) {

    return () => {
        ApplicationRegistry.registerWithOptions(options);
    };
}