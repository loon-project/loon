import {TypedContext} from "../server/TypedContext";

export class Webpacker {

    private defaultConfig: any;

    constructor() {
        this.defaultConfig = require('./webpack.config');
        const config: any = TypedContext.getConfig('webpack');

        if (config && config.main) {
            this.defaultConfig.entry.main = config.main;
        }

        if (config && config.vendor) {
            this.defaultConfig.entry.vendor = config.vendor;
        }
    }

    webpackConfig() {
        return this.defaultConfig;
    }
}