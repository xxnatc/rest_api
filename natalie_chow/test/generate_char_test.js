const expect = require('chai').expect;

const mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/salem_test';
const server = require(__dirname + '/../server');

const generateChar = require(__dirname + '/../lib/generate_characters');
const Town = require(__dirname + '/../models/town');
const Mafia = require(__dirname + '/../models/mafia');

describe('Characters generator', () => {
  before(() => {
    server.listen(3000);
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      server.close();
      done();
    });
  });

  it('should be able to add some towns and mafias', (done) => {
    var called = 0;
    generateChar().then(() => {
      var readTowns = new Promise((resolve) => {
        Town.find({}, (err, data) => {
          called++;
          expect(err).to.eql(null);
          resolve(data.length);
        });
      });

      var readMafias = new Promise((resolve) => {
        Mafia.find({}, (err, data) => {
          called++;
          expect(err).to.eql(null);
          resolve(data.length);
        });
      });

      Promise.all([readTowns, readMafias]).then((values) => {
        expect(called).to.eql(2);
        expect(values[0] + values[1]).to.be.above(0);
        done();
      });
    });
  });
});
