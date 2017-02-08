#! /usr/bin/env node --harmony
import * as Program from "commander";
import * as Fs from "fs";
import * as Path from 'path';
import * as FindUp from "find-up";
import {TypedApplicationInitializer} from "../server/TypedApplicationInitializer";

const clientPackageJsonFilePath = FindUp.sync('package.json');
const packageJson = require(clientPackageJsonFilePath);

if (typeof packageJson.typed === 'undefined') {
    throw new Error('[TYPED] missing typed property in package.json');
}

const typedFile = packageJson.typed;
const typedFilePath = Path.resolve(clientPackageJsonFilePath, '..', typedFile);

if (!Fs.existsSync(typedFilePath)) {
    throw new Error(`[TYPED] load failed. Can not find file: ${typedFile}`);
}

require(typedFilePath);

const initializer = new TypedApplicationInitializer();


Program
    .version(require('../../package.json').version);


Program
    .command('assets:compile')
    .description('# Compile all the assets named in assetsDir')
    .action(options => {
        console.log(`assets:compile ${options}`);
    });


Program
    .command('assets:clean')
    .description('# Remove compiled assets')
    .action(options => {
        console.log(`assets:clean ${options}`);
    });


Program
    .command('server')
    .alias('s')
    .description('# Start TypedServer server')
    .action((options) => {
        initializer.start();
    });

Program
    .command('db:migrate')
    .description('# Migrate the database (options: VERSION=x, VERBOSE=false, SCOPE=blog)')
    .action(options => {
        console.log('db:migrate');
    });


Program
    .command('db:rollback')
    .description('# Rolls the schema back to the previous version (specify steps w/ STEP=n)')
    .action(options => {
        console.log('db:rollback');
    });

Program.parse(process.argv);



