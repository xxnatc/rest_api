const expect = require('chai').expect;
const validSignup = require(__dirname + '/../lib/valid_signup');

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/salem_test';
const server = require(__dirname + '/../server');
const User = require(__dirname + '/../models/user');

describe('Signup validator', () => {
  describe('functionalities that require a populated DB', () => {
    before((done) => {
      server.listen(3000);
      var userData = {
        username: 'newuser@test.com',
        auth: {
          email: 'newuser@test.com',
          password: bcrypt.hashSync('newpassword', 8)
        }
      };
      User.create(userData, done);
    });

    after((done) => {
      mongoose.connection.db.dropDatabase(() => {
        server.close();
        done();
      });
    });

    it('should reject a request if the username is taken', (done) => {
      var testReq = {
        body: { email: 'newuser@test.com', password: 'decentlength' }
      };
      var testRes = {
        status: function(statusCode) {
          expect(statusCode).to.eql(400);
          return testRes;
        },
        json: function(obj) {
          expect(obj.msg).to.eql('username taken');
          done();
        }
      };
      validSignup(testReq, testRes);
    });

    it('should call next if input matches all requirements', (done) => {
      var testReq = {
        body: { email: 'brandnewuser@test.com', password: 'unicorns' }
      };
      validSignup(testReq, {}, done);
    });
  });

  describe('simple checks', () => {
    it('should reject a request with empty email', (done) => {
      var testReq = {
        body: { password: 'no email' }
      };
      var testRes = {
        status: function(statusCode) {
          expect(statusCode).to.eql(400);
          return testRes;
        },
        json: function(obj) {
          expect(obj.msg).to.eql('invalid username or password');
          done();
        }
      };
      validSignup(testReq, testRes);
    });

    it('should reject a request with password shorter than 8 characters', () => {
      var testReq = {
        body: { email: 'test@example.com', password: 'short' }
      };
      var testRes = {
        status: function(statusCode) {
          expect(statusCode).to.eql(400);
          return testRes;
        },
        json: function(obj) {
          expect(obj.msg).to.eql('invalid username or password');
          done();
        }
      };
      validSignup(testReq, testRes);
    });
  });
});
