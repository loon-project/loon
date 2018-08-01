
export interface SettingOptions {

    /**
     * The root folder of project
     */
    rootDir?: string;

    /**
     * List project files, use glob pattern, see details in https://github.com/isaacs/node-glob
     */
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

    host?: string

    backlog?: number

    serverOpts?: any

    ext?: string;

    lazyInit?: boolean;
}


