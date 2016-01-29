const expect = require('chai').expect;
const basicHTTP = require(__dirname + '/../lib/basic_http');

describe('Basic HTTP Auth', () => {
  it('should be able to catch invalid data', (done) => {
    var testRes = {
      status: function(statusCode) {
        expect(statusCode).to.eql(401);
        return testRes;
      },
      json: function(obj) {
        expect(obj.msg).to.eql('could not authenticate');
        done();
      }
    };
    basicHTTP({}, testRes);
  });

  it('should be able to decode base64 string', (done) => {
    var testReq = {
      headers: { authorization: 'Basic ' + new Buffer('test@example.com:helloworld').toString('base64') }
    };
    var testNext = function() {
      expect(testReq.basicHTTP.email).to.equal('test@example.com');
      expect(testReq.basicHTTP.password).to.equal('helloworld');
      done();
    };
    basicHTTP(testReq, {}, testNext);
  });
});
