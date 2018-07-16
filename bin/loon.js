#!/usr/bin/env node

const program = require('commander')
const nodemon = require('nodemon')
const pkg = require('../package.json')

program  
  .version(pkg.version)
  .arguments('<App.ts>')
  .description('start loon server in development mode, with hot reload by default')
  .option('-w, --watch', 'nodemon watch files')
  .option('-i, --ignore', 'nodemon ignore files')
  .option('-e, --ext', 'nodemon watch extensions')
  .action((script, cmd) => {
    nodemon({
      watch: cmd.watch,
      ignore: cmd.ignore,
      verbose: true,
      ext: cmd.ext,
      inspect: cmd.inspect,
      exec: 'ts-node',
      env: {
        "EXT": "ts"
      },
      script
    })
  })


program.parse(process.argv);


if (!process.argv.slice(2).length) {
  program.outputHelp()
}


