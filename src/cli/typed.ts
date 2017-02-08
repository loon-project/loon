#! /usr/bin/env node --harmony
import * as Program from 'commander';
import * as Path from 'path';
import * as Fs from 'fs';
import * as FindUp from 'find-up';
import {TypedApplicationInitializer} from "../server/TypedApplicationInitializer";

const clientPackageJsonFilePath = FindUp.sync('package.json');
const frameworkPackageJson = require('../../package.json');

checkClientPackageJsonFile();

const clientPackageJson = require('clientPackageJsonFilePath');

const clientApplicationFile = clientPackageJson.typed;

Program
    .version(frameworkPackageJson.version);


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
            require(clientApplicationFile);
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

    if (typeof clientPackageJson === 'undefined') {
        console.log('[TYPED] missing typed property in package.json');
        return 1;
    }
}



function checkClientPackageJsonFile() {

    if (!Fs.existsSync(clientPackageJsonFilePath)) {
        console.log('[TYPED] missing package.json file in your project, have you run `npm init`?');
        return 1;
    }
}

