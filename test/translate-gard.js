var fs = require('fs'),
    should = require('should'),
    translate_gard = require('../translate-gard.js');


describe('gard translater', function() {

  it('should have expected keys', function(done) {

    var files = {
      html : './test/CD2.nex.GARD.csv',
      finalout : './test/CD2.nex.GARD.csv_finalout',
      ga_details : './test/CD2.nex.GARD.csv_ga_details',
      splits : './test/CD2.nex.GARD.csv_splits',
      json : './test/CD2.nex.out.json'
    };

    translate_gard.toJSON(files, (err, gard) => {
      gard.should.have.property('breakpointData');
      gard.should.have.property('rateMatrix');
      gard.should.have.property('models').length(250);
      gard.should.have.property('baselineScore').approximately(7126.6, .1);
      gard.should.have.property('input');
      gard.should.have.property('timeElapsed').match(17);
      gard.should.have.property('potentialBreakpoints').match(409);

      // write to file once
      fs.writeFileSync('gard.json', JSON.stringify(gard));
      done();

    });

  });

  it('should handle exception gracefully', function(done) {

    var files = {
      html : './test/CD2.nex.GARD.csv',
      finalout : './test/empty_file',
      ga_details : './test/CD2.nex.GARD.csv_ga_details',
      splits : './test/CD2.nex.GARD.csv_splits',
      json : './test/CD2.nex.out.json'
    };

    translate_gard.toJSON(files, (err, gard) => {
      should.exist(err);
      done();
    });

  });

  it('should handle empty ga_details gracefully', function(done) {

    var files = {
      html : './test/CD2.nex.GARD.csv',
      finalout : './test/CD2.nex.GARD.csv_finalout',
      ga_details : './empty_file',
      splits : './test/CD2.nex.GARD.csv_splits',
      json : './test/CD2.nex.out.json'
    };

    translate_gard.toJSON(files, (err, gard) => {
      should.exist(err);
      done();
    });

  });

  it('should handle empty html file gracefully', function(done) {

    var files = {
      html : './test/empty_file',
      finalout : './test/CD2.nex.GARD.csv_finalout',
      ga_details : './test/CD2.nex.GARD.csv_ga_details',
      splits : './test/CD2.nex.GARD.csv_splits',
      json : './test/CD2.nex.out.json'
    };

    translate_gard.toJSON(files, (err, gard) => {
      should.exist(err);
      done();
    });

  });

  it('should handle empty splits file gracefully', function(done) {

    var files = {
      html : './test/CD2.nex.GARD.csv',
      finalout : './test/CD2.nex.GARD.csv_finalout',
      ga_details : './test/CD2.nex.GARD.csv_ga_details',
      splits : './test/empty_file',
      json : './test/CD2.nex.out.json'
    };

    translate_gard.toJSON(files, (err, gard) => {
      should.exist(err);
      done();
    });

  });

  it('should handle empty json file gracefully', function(done) {

    var files = {
      html : './test/CD2.nex.GARD.csv',
      finalout : './test/CD2.nex.GARD.csv_finalout',
      ga_details : './test/CD2.nex.GARD.csv_ga_details',
      splits : './test/CD2.nex.GARD.csv_splits',
      json : './test/empty_file'
    };

    translate_gard.toJSON(files, (err, gard) => {
      should.exist(err);
      done();
    });

  });

});
