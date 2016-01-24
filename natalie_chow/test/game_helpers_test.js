const expect = require('chai').expect;
const gameStatus = require(__dirname + '/../lib/game_status');
const gameOver = require(__dirname + '/../lib/game_over');

const mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/salem_test';
const server = require(__dirname + '/../server');

describe('Gameplay helpers', () => {
  describe('Game status', () => {
    before(() => {
      server.listen(3000);
    });

    after((done) => {
      mongoose.connection.db.dropDatabase(() => {
        server.close();
        done();
      });
    });
    it('should return a promise with character data from database', (done) => {
      var statusPromise = gameStatus();
      expect(statusPromise).to.be.a('promise');
      statusPromise.catch((values) => {
        expect(values).to.be.an('array');
        expect(values).to.have.length(2);
        done();
      });
    });
  });

  describe('Game over', () => {
    it('should write response based on data being passed', (done) => {
      var testRes = {
        status: function(statusCode) {
          expect(statusCode).to.eql(200);
          return testRes;
        },
        json: function(obj) {
          expect(obj.gameStatus).to.eql('-----GAME OVER-----');
          expect(obj.msg).to.eql('Towns win! 2 towns left and mafias are all eliminated.');
          done();
        }
      };
      gameOver([['test1', 'test2'], []], testRes);
    });
  });
});
