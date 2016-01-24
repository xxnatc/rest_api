const expect = require('chai').expect;
const Town = require(__dirname + '/../models/town');
const Mafia = require(__dirname + '/../models/mafia');
var actionsHelper = require(__dirname + '/../lib/actions_helper');

const mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/salem_test';
const server = require(__dirname + '/../server');

describe('Actions router helper', () => {
  before(() => {
    server.listen(3000);
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      server.close();
      done();
    });
  });

  it('should be able to trigger daytime actions', (done) => {
    var testRes = {
      status: function(statusCode) {
        expect(statusCode).to.eql(200);
        return testRes;
      },
      json: function(obj) {
        expect(obj).to.have.property('msg');
        done();
      }
    };
    actionsHelper.dayActions(testRes);
  });

  it('should be able to trigger nighttime actions', (done) => {
    var testRes = {
      status: function(statusCode) {
        expect(statusCode).to.eql(200);
        return testRes;
      },
      json: function(obj) {
        expect(obj).to.have.property('msg');
        done();
      }
    };
    actionsHelper.nightActions(testRes);
  });

  describe('resetting DB', () => {
    beforeEach((done) => {
      var createTown = new Promise((resolve) => {
        Town.create({name: 'test town'}, () => resolve() );
      });

      var createMafia = new Promise((resolve) => {
        Mafia.create({name: 'test mafia'}, () => resolve() );
      });

      Promise.all([createTown, createMafia]).then(() => {
        done();
      });
    });

    it('should be able to delete all entries in the database', (done) => {
      actionsHelper.clearDB().then(() => {
        var readTowns = new Promise((resolve) => {
          Town.find({}, (_, data) => resolve(data.length) );
        });

        var readMafias = new Promise((resolve) => {
          Mafia.find({}, (_, data) => resolve(data.length) );
        });

        Promise.all([readTowns, readMafias]).then((values) => {
          expect(values[0]).to.eql(0);
          expect(values[1]).to.eql(0);
          done();
        });
      });
    });
  });
});
