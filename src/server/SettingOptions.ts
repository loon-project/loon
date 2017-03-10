
export interface SettingOptions {

    /**
     * Required
     * The root folder of project
     */
    rootDir: string;

    /**
     * The source code files folder of project
     * Default value: `${rootDir}/src`
     */
    srcDir?: string;

    /**
     * The public files folder of project
     * Default value: `${rootDir}/public`
     */
    publicDir?: string;

    /**
     * The logger files folder of project
     * Default value: `${rootDir}/log`
     */
    logDir?: string;

    /**
     * The configuration files folder of project
     * Default value: `${rootDir}/config`
     */
    configDir?: string;

    /**
     * The database seed and migration files folder of project
     * Default value: `${rootDir}/db`
     */
    dbDir?: string;

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
    port?: string|number;

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


