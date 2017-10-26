#!/usr/bin/env node
var translate_gard = require('./translate-gard.js'),
  pd = require('pretty-data').pd,
  fs = require('fs');

var filename = process.argv[2],
  files = {
    html : filename,
    finalout : filename + '_finalout',
    ga_details : filename + '_ga_details',
    splits : filename + '_splits'
  },
  output = filename + '.json';

translate_gard.toJSON(files, (err, gard) => {
  fs.writeFileSync(output, pd.json(gard));
});


