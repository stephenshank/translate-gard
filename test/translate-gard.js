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

});
