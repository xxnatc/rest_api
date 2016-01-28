const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const jwtAuth = require(__dirname + '/../lib/jwt_auth');

process.env.APP_SECRET = 'testsecret';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/salem_test';
const server = require(__dirname + '/../server');
const User = require(__dirname + '/../models/user');



describe('JWT auth that requires a populated DB', () => {
  before((done) => {
    server.listen(3000);

    var userData = {
      username: 'newuser@test.com',
      auth: {
        email: 'newuser@test.com',
        password: bcrypt.hashSync('newpassword', 8)
      }
    };
    // User.create(userData, done);
    User.create(userData, (err, data) => {
      this.testUser = data;
      done();
    });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      server.close();
      done();
    });
  });

  it('should allow access with a valid token', (done) => {
    var testReq = {
      headers: {
        token: jwt.sign({ id: this.testUser._id }, process.env.APP_SECRET)
      }
    };

    var testNext = () => {
      expect(testReq.user._id).to.eql(this.testUser._id);
      done();
    };

    jwtAuth(testReq, {}, testNext);
  });

});

describe('JWT auth', () => {
  it('should reject an invalid token', (done) => {
    var testReq = {
      headers: {
        token: jwt.sign({ id: 'randomid' }, 'wrongsecretkey')
      }
    };

    var testRes = {
      status: function(statusCode) {
        expect(statusCode).to.eql(401);
        return testRes;
      },
      json: function(obj) {
        expect(obj.msg).to.eql('invalid token');
        done();
      }
    };

    jwtAuth(testReq, testRes);
  });

  it('should check for user existence', (done) => {
    var testReq = {
      headers: {
        token: jwt.sign({ id: 'doesnotexist56c4101d700a' }, process.env.APP_SECRET)
      }
    };

    var testRes = {
      status: function(statusCode) {
        expect(statusCode).to.eql(401);
        return testRes;
      },
      json: function(obj) {
        expect(obj.msg).to.eql('user does not exist');
        done();
      }
    };

    jwtAuth(testReq, testRes);
  });
});
