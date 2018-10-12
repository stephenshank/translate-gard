var fs = require('fs'),
    should = require('should'),
    translate_gard = require('../translate-gard.js');


describe('gard translater', function() {

  it('CD2 should have expected keys', function(done) {

    var files = {
      html : './test/CD2/CD2.nex.GARD.csv',
      finalout : './test/CD2/CD2.nex.GARD.csv_finalout',
      ga_details : './test/CD2/CD2.nex.GARD.csv_ga_details',
      splits : './test/CD2/CD2.nex.GARD.csv_splits',
      json : './test/CD2/CD2.nex.out.json'
    };

    translate_gard.toJSON(files, (err, gard) => {
      gard.should.have.property('breakpointData');
      gard.should.have.property('rateMatrix');
      gard.should.have.property('models').length(250);
      gard.should.have.property('baselineScore').approximately(7126.6, .1);
      gard.should.have.property('input');
      gard.should.have.property('timeElapsed').match(17);
      gard.should.have.property('potentialBreakpoints').match(409);

      done();

    });

  });

  it('Flu (Beta/Gamma rate variation, 2 bins) should have expected keys', function(done) {

    var files = {
      html : './test/Flu_BetaGamma_2bins/FluBG2.GARD',
      finalout : './test/Flu_BetaGamma_2bins/FluBG2.GARD_finalout',
      ga_details : './test/Flu_BetaGamma_2bins/FluBG2.GARD_ga_details',
      splits : './test/Flu_BetaGamma_2bins/FluBG2.GARD_splits',
      json : './test/Flu_BetaGamma_2bins/FluBG2.GARD.json'
    };

    translate_gard.toJSON(files, (err, gard) => {
      gard.should.have.property('breakpointData');
      gard.should.have.property('rateMatrix');
      gard.should.have.property('models').length(661);
      gard.should.have.property('baselineScore').approximately(8787.0, .1);
      gard.should.have.property('input');
      gard.should.have.property('timeElapsed').match(130);
      gard.should.have.property('potentialBreakpoints').match(838);

      done();

    });

  });

  it('Flu (General discrete rate variation, 3 bins) should have expected keys', function(done) {

    var files = {
      html : './test/Flu_GeneralDiscrete_3bins/FluGD3.GARD',
      finalout : './test/Flu_GeneralDiscrete_3bins/FluGD3.GARD_finalout',
      ga_details : './test/Flu_GeneralDiscrete_3bins/FluGD3.GARD_ga_details',
      splits : './test/Flu_GeneralDiscrete_3bins/FluGD3.GARD_splits',
      json : './test/Flu_GeneralDiscrete_3bins/FluGD3.GARD.json'
    };

    translate_gard.toJSON(files, (err, gard) => {
      gard.should.have.property('breakpointData');
      gard.should.have.property('rateMatrix');
      gard.should.have.property('models').length(547);
      gard.should.have.property('baselineScore').approximately(8787.7, .1);
      gard.should.have.property('input');
      gard.should.have.property('timeElapsed').match(185);
      gard.should.have.property('potentialBreakpoints').match(838);

      done();

    });

  });

  it('should handle exception gracefully', function(done) {

    var files = {
      html : './test/CD2/CD2.nex.GARD.csv',
      finalout : './test/CD2/empty_file',
      ga_details : './test/CD2/CD2.nex.GARD.csv_ga_details',
      splits : './test/CD2/CD2.nex.GARD.csv_splits',
      json : './test/CD2/CD2.nex.out.json'
    };

    translate_gard.toJSON(files, (err, gard) => {
      should.exist(err);
      done();
    });

  });

  it('should handle empty ga_details gracefully', function(done) {

    var files = {
      html : './test/CD2/CD2.nex.GARD.csv',
      finalout : './test/CD2/CD2.nex.GARD.csv_finalout',
      ga_details : './empty_file',
      splits : './test/CD2/CD2.nex.GARD.csv_splits',
      json : './test/CD2/CD2.nex.out.json'
    };

    translate_gard.toJSON(files, (err, gard) => {
      should.exist(err);
      done();
    });

  });

  it('should handle empty html file gracefully', function(done) {

    var files = {
      html : './test/CD2/empty_file',
      finalout : './test/CD2/CD2.nex.GARD.csv_finalout',
      ga_details : './test/CD2/CD2.nex.GARD.csv_ga_details',
      splits : './test/CD2/CD2.nex.GARD.csv_splits',
      json : './test/CD2/CD2.nex.out.json'
    };

    translate_gard.toJSON(files, (err, gard) => {
      should.exist(err);
      done();
    });

  });

  it('should handle empty splits file gracefully', function(done) {

    var files = {
      html : './test/CD2/CD2.nex.GARD.csv',
      finalout : './test/CD2/CD2.nex.GARD.csv_finalout',
      ga_details : './test/CD2/CD2.nex.GARD.csv_ga_details',
      splits : './test/CD2/empty_file',
      json : './test/CD2/CD2.nex.out.json'
    };

    translate_gard.toJSON(files, (err, gard) => {
      should.exist(err);
      done();
    });

  });

  it('should handle empty json file gracefully', function(done) {

    var files = {
      html : './test/CD2/CD2.nex.GARD.csv',
      finalout : './test/CD2/CD2.nex.GARD.csv_finalout',
      ga_details : './test/CD2/CD2.nex.GARD.csv_ga_details',
      splits : './test/CD2/CD2.nex.GARD.csv_splits',
      json : './test/CD2/empty_file'
    };

    translate_gard.toJSON(files, (err, gard) => {
      should.exist(err);
      done();
    });

  });

});
