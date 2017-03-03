import {SettingOptions} from "./interface/SettingOptions";

export class ApplicationRegistry {

    public static settings: SettingOptions;

    public static registerWithOptions(options: SettingOptions) {
        this.settings = options;
    }
}