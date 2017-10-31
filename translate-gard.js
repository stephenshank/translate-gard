var fs = require("fs"),
  _ = require("lodash"),
  jsdom = require("jsdom");

/*
 * returns model information from ga_details file
 */
function getModels(filename) {

  var format_breakpoint = function(bp) {

    var bps = bp.split(",");
    var fmt_bps = _.map(bps, bp => {
      return _.map(bp.split("-"), _.unary(parseInt));
    });

    return fmt_bps;
  };

  // first add model information
  return new Promise((resolve, reject) => {

    fs.readFile(filename, (err, data) => {
      // read in data into models format
      // split data into every two lines
      var strings = _.chunk(String(data).trim().split("\n"), 2);

      // format the models object
      var models = _.map(strings, d => {
        return {
          aicc: d[0],
          breakpoints: format_breakpoint(d[1])
        };
      });

      var breakpoint_groups = _.groupBy(models, d=>d.breakpoints.length);
      var improvements = _.mapValues(breakpoint_groups, val => {
        return val.reduce((a,b) => +a.aicc <= +b.aicc ? a : b);
      });
      var formatted = [];
      _.each(improvements, (val, key) => {
        formatted[+key-2] = {
          aicc: +val.aicc,
          breakpoints: val.breakpoints
            .slice(1, val.breakpoints.length)
            .map(bps=>bps[0]-1)
        };
      }); 
      formatted.pop();

      resolve({
        models: models,
        improvements: formatted 
      });
    });
  });
}

/*
 * gets baseline score from generated html file
 */
function getBaselineScore(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {

      // read in data into jsdom
      // then get all cells
      var dom = new jsdom.JSDOM(String(data));
      var spans = dom.window.document.querySelectorAll("span");

      var baseline_score = parseFloat(_.last(spans).innerHTML);
      resolve(baseline_score);

    });
  });
}


/*
 * gets tree information from NEXUS file
 */
function getBreakpointData(filename) {
  // first add model information
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      var nexus_file = String(data);

      // Parse out TREE information
      var trees = nexus_file.split("BEGIN TREES;")[1];
      trees = trees.split("END;")[0];

      trees = _.map(trees.split("\n"), d => {
        return d.trim();
      });
      trees = _.filter(trees, d => {
        return !_.isEmpty(d);
      });
      trees = _.map(trees, d => {
        return d.split("=")[1].trim();
      });

      // Parse out Partition information
      var parts = nexus_file.split("BEGIN ASSUMPTIONS;")[1];
      parts = parts.split("END;")[0];
      parts = _.map(parts.split("\n"), d => {
        return d.trim();
      });
      parts = _.filter(parts, d => {
        return !_.isEmpty(d);
      });
      parts = _.map(parts, d => {
        return d.split("=")[1].trim();
      });
      parts = _.map(parts, bp => {
        return _.map(bp.split("-"), _.unary(parseInt));
      });

      // zip partitions and trees
      bp_data = _.zip(trees, parts);
      bp_data = _.map(bp_data, d => {
        return { tree: d[0], bps: d[1] };
      });

      resolve(bp_data);

    });
  });
}

function getHyPhyJSON(filename) {

  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      var obj = JSON.parse(data);
      resolve(obj);
    });
  });


}

/*
  *@params files
  *{
  *   html: ./CD2.nex.csv,
  *   finalout: ./CD2.nex.csv_finalout,
  *   ga_details: ./CD2.nex.csv_ga_details,
  *   splits: ./CD2.nex.csv_splits,
  *   json: ./CD2.nex.json
  *}
  */
function toJSON(files, cb) {
  // json element

  Promise.all([
    getModels(files.ga_details),
    getBaselineScore(files.html),
    getBreakpointData(files.finalout),
    getHyPhyJSON(files.json)
  ]).then(values => {

    var gard = {},
      improvements = values[0].improvements,
      baselineScore = values[1];

    gard.models = values[0].models;
    gard.baselineScore = baselineScore;
    gard.breakpointData = values[2];
    gard.totalModelCount = values[0].length;

    if(improvements[0].aicc <= baselineScore){
      gard.improvements = improvements.map((d,i) => {
        var otherAIC = i == 0 ? gard.baselineScore : improvements[i-1].aicc;
        return {
          deltaAICc: otherAIC - d.aicc,
          breakpoints: d.breakpoints
        };
      });
    }

    // combine JSON from HyPhy
    Object.assign(gard, values[3]);
    cb(null, gard);

  });

}

module.exports.toJSON = toJSON;
