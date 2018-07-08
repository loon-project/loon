
export interface SettingOptions {

    /**
     * Required
     * The root folder of project
     */
    rootDir?: string;

    files?: string

    /**
     * The application environment, development, test, production, staging
     * `process.env.NODE_ENV` overwrite everything
     * Default value: 'development'
     */
    env?: string;

    /**
     * The server running port
     * `process.env.PORT` overwrite everything
     * Default value: 9000
     */
    port?: string;

    /**
     * API mount path, a Map<string, string> data structure
     * key is the url path of mount routers
     * value is the file path to the mount routers
     * Default value: {}
     */
    routes?: {[key: string]: string};

    /**
     * List all components need to initialization and add to DependencyInjectionRegistry
     * Default value: []
     */
    components?: string[];

}


