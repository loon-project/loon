import {TypedContext} from "../server/TypedContext";
import * as Path from 'path';
import * as Fs from 'fs';

export class Webpacker {

    private defaultConfig: any;

    constructor() {
        this.defaultConfig = require('./webpack.config');
        const config: any = TypedContext.getConfig('webpack');
        this.mergeConfig(config, ['entry']);
    }

    webpackConfig() {
        return this.defaultConfig;
    }

    private mergeConfig(config, properties) {
        properties.forEach(property => {
            if (config && config[property]) {
                if (Array.isArray(config[property])) {
                    this.defaultConfig[property] = config[property].map(this.extendFile);
                } else {
                    this.defaultConfig[property] = this.extendFile(config[property]);
                }
            } else {
                throw new Error('[TYPED] no entry file specified');
            }
        });

    }

    private extendFile(file) {
        if (Path.isAbsolute(file)) {
            if (Fs.existsSync(file)) {
                return file;
            } else {
                throw new Error(`[TYPED] error file path: ${file}`);
            }
        } else {
            const path = Path.resolve(TypedContext.assetsDir, file);
            if (Fs.existsSync(path)) {
                return path;
            } else {
                throw new Error(`[TYPED] error file path: ${file}. 
                    The file in webpack.json should be relative to assetsDir: ${TypedContext.assetsDir}`);
            }
        }
    }
}