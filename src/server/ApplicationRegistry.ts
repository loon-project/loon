import {SettingOptions} from "./interface/SettingOptions";

export class ApplicationRegistry {

    public static settings: SettingOptions;

    public static registerWithOptions(options: SettingOptions) {
        const rootDir = this.settings.rootDir;
        const defaultSettings = this.defaultSettings(rootDir);
        this.settings =  Object.assign({}, defaultSettings, options);
        return this.settings;
    }

    private static defaultSettings(rootDir): SettingOptions {
        return <SettingOptions>{
            rootDir,
            env: "development",
            port: 9000,
            baseUrl: "/",
            mount: {
                "/": `${rootDir}/src/controllers/`
            },
            components: [
                `${rootDir}/src/middlewares/`,
                `${rootDir}/src/services/`
            ]
        };
    }
}