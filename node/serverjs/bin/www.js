#!/usr/bin/env node
const {program } = require("commander");
const chalk = require("chalk");
program.version('1.0.0');
program.option('-p, --port <type>')
.option('-h, --host <type>')
.option('-d, --dir <type>');
program.parse(process.args);
const options = program.opts();
console.log(options.port,options.host,options.dir );

const serve = new Serve({});
serve.start()