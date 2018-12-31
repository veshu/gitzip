#!/usr/bin/env node

"use strict";

const path = require("path");
var zip = require("../lib/gitzip.js");

var yargonaut = require("yargonaut")
  .style("blue")
  .font("Small Slant")
  .helpStyle("green")
  .errorsStyle("red");

var chalk = yargonaut.chalk();

var argv = require("yargs")
  .usage("\nUsage: gitzip [options]")
  .example("gitzip -s . -d submission.zip")
  .option("source", {
    alias: "s",
    default: ".",
    describe: "path of the folder to archive"
  })
  .option("destination", {
    alias: "d",
    default: "submission.zip",
    describe: "the output zip file path"
  })
  .option("exclude", {
    alias: "x",
    type: "array",
    describe: "excludes the file/folder based on pattern"
  })
  .option("include", {
    alias: "i",
    type: "array",
    describe:
      "includes the file/folder based on pattern, include has more priority than exclude"
  })
  .help("help")
  .wrap(null)
  .strict()
  .alias("help", "h").argv;

const options = {
  source: argv.source,
  destination: argv.destination
};
if (argv.exclude) {
  options.ignore = argv.exclude;
}
if (argv.include) {
  options.include = argv.include;
}
console.info(
  chalk.yellow(`Archiving "${options.source}" to "${options.destination}"`)
);
const cwd = process.cwd();
const outputPath = path.resolve(cwd, options.destination);
zip(options)
  .then(function() {
    console.log(chalk.green(`Zip file ready at ${outputPath}`));
  })
  .catch(function(err) {
    console.log(chalk.red(err.message));
    process.exit(1);
  });
