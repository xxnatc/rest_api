const expect = require('chai').expect;
const gameDay = require(__dirname + '/../lib/game_day');
const gameNight = require(__dirname + '/../lib/game_night');

describe('Gameplay actions', () => {
  describe('Daytime', () => {
    it('should not lynch anyone if no crime was committed', (done) => {
      var testRes = {
        status: function(statusCode) {
          expect(statusCode).to.eql(200);
          return testRes;
        },
        json: function(obj) {
          expect(obj.msg).to.eql('No one is voted to be lynched.');
          done();
        }
      };
      gameDay(false, [], testRes);
    });

    it('should randomly lynch a character if a crime was committed', (done) => {
      var testValues = [[{ name: 'testname' }], []];
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
      gameDay(true, testValues, testRes);
    });
  });

  describe('Nighttime', () => {
    it('should return a boolean to indicate if a crime has been committed', () => {
      var testValues = [
        [{ name: 'town1' }, { name: 'town2' }, { name: 'town3' }],
        [{ name: 'mafia1' }, { name: 'mafia2' }, { name: 'mafia3' }]
      ];
      var testRes = {
        status: function(statusCode) {
          expect(statusCode).to.eql(200);
          return testRes;
        },
        json: function(obj) {
          expect(obj).to.have.property('msg');
        }
      };
      var testCrime = gameNight(testValues, testRes);
      expect(testCrime).to.be.a('boolean');
    });
  });

  it('should always trigger a crime with 1 mafia left', () => {
    var testValues = [[{ name: 'town1' }, { name: 'town2' }], [{ name: 'mafia1' }]];
    var testRes = {
      status: function(statusCode) {
        expect(statusCode).to.eql(200);
        return testRes;
      },
      json: function(obj) {
        expect(obj).to.have.property('msg');
      }
    };
    var testCrime = gameNight(testValues, testRes);
    expect(testCrime).to.eql(true);
  });
});
