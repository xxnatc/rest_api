const expect = require('chai').expect;
const mathHelper = require(__dirname + '/../lib/math_helper');

describe('Math helper function', () => {
  it('should generate a random integer within specified range', () => {
    var rand = mathHelper.random(0, 100);
    expect(parseInt(rand)).to.eql(rand);
    expect(rand >= 0 && rand <= 100).to.eql(true);

    var rand2 = mathHelper.random(10.5, 32.14);
    expect(parseInt(rand2)).to.eql(rand2);
    expect(rand2 >= 10.5 && rand2 <= 32.14).to.eql(true);
  });
});
