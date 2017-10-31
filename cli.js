#!/usr/bin/env node

var translate_gard = require("./translate-gard.js"),
  pd = require("pretty-data").pd,
  fs = require("fs");

var argv = require("optimist")
  .demand("i", "")
  .describe("i", "input filename (like CD2.nex.GARD.csv)")
  .demand("j", "")
  .describe("j", "json filename (like CD2.nex.out.json")
  .demand("o", "")
  .describe("o", "output filename").argv;

var filename = argv.i,
  json_fn = argv.j,
  output_fn = argv.o,
  files = {
    html: filename,
    finalout: filename + "_finalout",
    ga_details: filename + "_ga_details",
    splits: filename + "_splits",
    json: filename + ".out.json"
  },
  output = output_fn;

translate_gard.toJSON(files, (err, gard) => {
  fs.writeFileSync(output, pd.json(gard));
});
