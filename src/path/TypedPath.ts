import {TypedApplicationOption} from "../server/TypedApplicationOption";
import * as Path from 'path';
import * as _ from 'lodash';

export class TypedPath {

    public static rootDir;
    public static srcDir;
    public static publicDir;
    public static logDir;
    public static configDir;
    public static dbDir;
    public static viewDir;
    public static assetsDir;

    public static init(options: TypedApplicationOption) {
        if (_.isEmpty(options)) {
            options = {};
        }

        this.rootDir = options.rootDir ? options.rootDir : __dirname;
        this.srcDir = options.srcDir ? options.srcDir : Path.resolve(this.rootDir, 'src');
        this.logDir = options.logDir ? options.logDir : Path.resolve(this.rootDir, 'log');
        this.configDir = options.configDir ? options.configDir : Path.resolve(this.rootDir, 'config');
        this.assetsDir = options.assetsDir ? options.assetsDir : Path.resolve(this.rootDir, 'assets');
        this.publicDir = options.publicDir ? options.publicDir : Path.resolve(this.rootDir, 'public');
        this.viewDir = options.viewsDir ? options.viewsDir : Path.resolve(this.srcDir, 'views');
    }

}