"use strict";

const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const asyncL = require("async");
const globby = require("globby");
var mkdirp = require("mkdirp");

const zipIt = (files, options) =>
  new Promise((resolve, reject) => {
    const cwd = options.cwd || process.cwd();
    const outputPath = path.resolve(cwd, options.destination);
    if (!fs.existsSync(path.dirname(outputPath))) {
      mkdirp.sync(path.dirname(outputPath));
    }
    const output = fs.createWriteStream(outputPath);
    const archive = archiver("zip");
    output.on("close", resolve);
    archive.on("error", reject);
    archive.pipe(output);
    function addSource(source, next) {
      const cwd = options.cwd || process.cwd();
      const fullPath = path.resolve(cwd, options.source, source);
      const destPath = source;
      fs.stat(fullPath, (err, stats) => {
        if (err) {
          return next(err);
        }
        if (stats.isFile()) {
          archive.file(fullPath, { stats: stats, name: destPath });
        }
        return next();
      });
    }
    asyncL.forEach(files, addSource, err => {
      if (err) {
        return reject(err);
      }
      archive.finalize();
    });
  });

async function getFiles(options) {
  const cwd = options.cwd || process.cwd();
  const globOptions = {
    dot: true,
    cwd: path.resolve(cwd, options.source),
    gitignore: true,
    ignore: [".git"],
    noglobstar: false,
    noext: true, // no (a|b)
    nobrace: true // no {a,b}
  };
  if (options.ignore && Array.isArray(options.ignore)) {
    globOptions.ignore = globOptions.ignore.concat(options.ignore);
  }
  let patterns = ["**"];
  if (options.include && Array.isArray(options.include)) {
    patterns = patterns.concat(options.include);
  }
  globOptions.ignore = globOptions.ignore.filter(el => !patterns.includes(el));
  return await globby(patterns, globOptions);
}

async function nodeArchive(options) {
  const files = await getFiles(options);
  if (!files.length) {
    throw Error("No files matched to zip.");
  }
  await zipIt(files, options);
}

async function zip(options) {
  await nodeArchive(options);
}

module.exports = zip;
module.exports.zip = zip;
module.exports.nodeZip = nodeArchive;
