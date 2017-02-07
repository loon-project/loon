import * as Program from 'commander';

const packageJson = require('../../package.json');


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
    .command('server <file>')
    .alias('s')
    .description('# Start TypedApplication server')
    .action((file, options) => {
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


