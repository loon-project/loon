import {TypedContext} from "../server/TypedContext";
import * as _ from 'lodash';
import * as Path from 'path';
import * as Fs from 'fs';

export class Webpacker {

    private defaultConfig: any;

    constructor() {
        this.defaultConfig = require('./webpack.config');
        const config: any = TypedContext.getConfig('webpack');

        if (_.isEmpty(config)) {
            throw new Error('[TYPED] webpack.json configuration found');
        }

        this.mergeConfig(config, ['entry']);
    }

    webpackConfig() {
        return this.defaultConfig;
    }

    private mergeConfig(config, properties) {
        properties.forEach(property => {
            if (config && config[property]) {

                if (property === 'entry') {
                    this.defaultConfig[property] = this.normalizeEntryConfig(config[property]);
                }

            } else {
                throw new Error('[TYPED] no entry file specified');
            }
        });

    }

    private normalizeEntryConfig(config) {
        let ret = {};

        for (let key in config) {
            if (config.hasOwnProperty(key)) {
                ret[key] = this.normalizeEntryFilePath(config[key]);
            }
        }

        return ret;
    }

    private normalizeEntryFilePath(file) {
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