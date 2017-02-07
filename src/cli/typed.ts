#! /usr/bin/env node --harmony
import * as Program from 'commander';
import * as Path from 'path';
import {TypedApplicationInitializer} from "../server/TypedApplicationInitializer";

const packageJson = require('../../package.json');

const initFile = packageJson['typed'];

if (typeof initFile !== 'undefined') {
    require(initFile);
    const initializer = new TypedApplicationInitializer();
} else {

}

Program
    .version(packageJson.version);


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
    .action((file, options) => {
        const filePath = Path.resolve(file);
        const initializer = new TypedApplicationInitializer(filePath);
        initializer.init();

        const typdApplication = require(file);
        console.log(`server ${file}`);
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


