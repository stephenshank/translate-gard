var fs = require('fs'),
    should = require('should'),
    babel_gard = require('../babel-gard.js');


describe('gard translater', function() {

  it('should have expected keys', function(done) {

    var files = {
      html : './test/CD2.nex.GARD.csv',
      finalout : './test/CD2.nex.GARD.csv_finalout',
      ga_details : './test/CD2.nex.GARD.csv_ga_details',
      splits : './test/CD2.nex.GARD.csv_splits',
    };

    babel_gard.toJSON(files, (err, gard) => {
      gard.should.have.property('breakpointData');
      gard.should.have.property('rateMatrix');
      gard.should.have.property('models');
      gard.should.have.property('baselineScore').approximately(7126.6, .1);
      // write to file once
      fs.writeFileSync('gard.json', JSON.stringify(gard));
      done();
    });

  });

});
