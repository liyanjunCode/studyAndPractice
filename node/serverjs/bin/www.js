#!/usr/bin/env node
const { program } = require("commander");
const chalk = require("chalk");
const { Serve } = require("../src/server");
const { config } = require("./config");
const { vesion } = require("../package.json");
program.version(vesion);
program
    .name("my-command")
    .usage("[global options] command")
Object.values(config).forEach(item => {
    program.option(item.options, item.des)
    program.addHelpText('after', "jdh")
})
program.on("help", function (ss) {
    console.log(ss, "soossk")
})
program.parse(process.args);
const options = program.opts();

const configs = {};
Object.keys(config).forEach(key => {
    configs[key] = options[key] || config[key].default
})
const servers = new Serve(configs);
servers.start()