"use strict";
const child_process = require("child_process");
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const klaw = require("klaw-sync");

var unzip = require("./unzip");

const gitzip = require("../lib/gitzip");

const cli = path.join(__dirname, "../bin/cli.js");

const tmpdir = path.join(__dirname, "tmp");
const destination = "tests/tmp/test.zip";

const testCases = [
  { destination: destination, source: "tests/fixtures" },
  { destination: destination, source: "tests/fixtures/" },
  {
    destination: destination,
    source: "tests/fixtures",
    exclude: [".dotfile"],
    include: [".dotfile"]
  },
  {
    destination: destination,
    source: "tests/fixtures",
    exclude: [".dotfile"],
    include: ["test.log"]
  },
  { destination: destination, source: "tests/fixtures/sub/" }
];

const cleanup = () =>
  new Promise((resolve, reject) => {
    rimraf(tmpdir, err => {
      if (err) {
        return reject(err);
      }
      fs.mkdir(tmpdir, err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });

const getStructure = tmpdir => {
  // strip the tmp dir and convert to unix-style file paths on windows
  return klaw(tmpdir).map(({ path }) =>
    path.replace(tmpdir, "").replace(/\\/g, "/")
  );
};

describe("file structure", () => {
  beforeEach(cleanup);

  // these tests have known good snapshots
  // so, it's run once for gitzip against the snapshot
  // and, if gitzip used
  test.each(testCases)("cli: %j", async testCase => {
    let command = `node ${cli} -d ${destination} -s ${testCase.source}`;
    if (testCase.exclude) {
      command += ` -x ${testCase.exclude}`;
    }
    if (testCase.include) {
      command += ` -i ${testCase.include}`;
    }

    child_process.execSync(command);

    await unzip(destination, tmpdir);
    const structure = getStructure(tmpdir);

    expect(structure).toMatchSnapshot();

    // because multiple tests aren't allowed to match the same snapshot,
    // but we do want to ensure that they all create the same output
    testCase.structure = structure;
  });

  test.each(testCases)("programmatic: %j", async testCase => {
    const options = {
      destination: testCase.destination,
      source: testCase.source
    };
    if (testCase.exclude) {
      options.ignore = testCase.exclude;
    }
    if (testCase.include) {
      options.include = testCase.include;
    }
    await gitzip(options);
    await unzip(destination, tmpdir);
    const structure = getStructure(tmpdir);

    expect(structure).toMatchSnapshot();

    if (testCase.structure) {
      expect(structure).toEqual(testCase.structure);
    } else {
      // the structure is defined in the first test run, so it may not be defined when running subsets of tests
      console.log("skipping structure match");
    }
  });
});
