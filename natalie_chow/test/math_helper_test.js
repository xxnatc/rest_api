const expect = require('chai').expect;
const mathHelper = require(__dirname + '/../lib/math_helper');

describe('Math helper', () => {
  describe('.random()', () => {
    it('should generate a random integer within specified range', () => {
      var rand = mathHelper.random(0, 100);
      expect(parseInt(rand)).to.eql(rand);
      expect(rand).to.be.within(0, 100);
    });
  });

  describe('.randomItem()', () => {
    it('should return a random item from the given array', () => {
      var testArray = ['a', 'b', 'c', 'd', 'e'];
      var result = mathHelper.randomItem(testArray);
      expect(testArray.indexOf(result)).to.be.gt(-1);
    });
  });

  describe('.takeAction()', () => {
    it('should return a boolean', () => {
      expect(mathHelper.takeAction(50)).to.be.a('boolean');
    });
  });

  describe('.chance()', () => {
    it('should return a random number between 0 (inclusive) and 1 (exclusive)', () => {
      expect(mathHelper.chance()).to.be.lt(1);
    });
  });
});
