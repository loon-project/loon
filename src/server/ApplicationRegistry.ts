import {SettingOptions} from "./SettingOptions";
import {DependencyRegistry} from "../di/DependencyRegistry";
import {Klass} from "../core/Klass";

export class ApplicationRegistry {

    public static settings: SettingOptions;

    public static registerWithOptions(target: Function, options: SettingOptions) {
        DependencyRegistry.registerComponent(<Klass>target);
        this.settings = options;
    }
}