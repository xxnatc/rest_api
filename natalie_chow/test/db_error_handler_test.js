const expect = require('chai').expect;
const dbErrorHandler = require(__dirname + '/../lib/db_error_handler');

describe('DB error handler function', () => {
  it('should set a status code and respond with error msg', () => {
    var called = 0;
    var testRes = {
      status: function(statusCode) {
        called++;
        expect(statusCode).to.eql(500);
        return testRes;
      },
      json: function(obj) {
        called++;
        expect(obj.msg).to.eql('server error');
      }
    };
    dbErrorHandler(null, testRes);
    expect(called).to.eql(2);
  });
});
