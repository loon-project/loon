#! /usr/bin/env node --harmony
import * as Program from 'commander';
import * as Path from 'path';
import {TypedApplicationInitializer} from "../server/TypedApplicationInitializer";

const packageJson = require('../../package.json');

const initFile = packageJson['typed'];


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
    .action((options) => {

        if (checkPropertyInPackageJson()) {
            require(initFile);
            const initializer = new TypedApplicationInitializer();
            initializer.start();
        }

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

function checkPropertyInPackageJson() {
    if (typeof initFile === 'undefined') {
        console.log('[TYPED] missing the initialize file in package.json');
        return false;
    }

    return true;
}


