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

      resolve(models);
    });
  });
}

/*
 * gets rate matrix from generated html file
 */
function getRateMatrix(filename) {
  // first add model information
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      // read in data into jsdom
      // then get all cells
      var dom = new jsdom.JSDOM(String(data));
      var tds = dom.window.document.querySelectorAll("td");

      // convert each row in table to matrix row
      var rate_matrix = _.chunk(
        _.map(tds, td => {
          return td.innerHTML;
        }),
        4
      );

      resolve(rate_matrix);
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

      bp_data = _.zip(trees, parts);
      bp_data = _.map(bp_data, d => {
        return { tree: d[0], bps: d[1] };
      });

      resolve(bp_data);

    });
  });
}

/*
  *@params files
  *{
  *   html: ./CD2.nex.csv,
  *   finalout: ./CD2.nex.csv_finalout,
  *   ga_details: ./CD2.nex.csv_ga_details,
  *   splits: ./CD2.nex.csv_splits
  *}
  */
function toJSON(files, cb) {
  // json element

  Promise.all([
    getModels(files.ga_details),
    getRateMatrix(files.html),
    getBreakpointData(files.finalout)
  ]).then(values => {

    var gard = {};
    gard.models = values[0];
    gard.rateMatrix = values[1];
    gard.breakpointData = values[2];
    gard.totalModelCount = values[0].length;
    cb(null, gard);

  });

}

module.exports.toJSON = toJSON;
