const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/salem_test';
const server = require(__dirname + '/../server');
const User = require(__dirname + '/../models/user');

describe('Auth router', () => {
  before(() => {
    server.listen(3000);
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      server.close();
      done();
    });
  });

  it('should be able to create a user', (done) => {
    request('localhost:3000')
      .post('/api/signup')
      .send({email: 'test@example.com', password: 'helloworld'})
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  describe('sign in route', () => {
    before((done) => {
      var userData = {
        username: 'newuser@test.com',
        auth: {
          email: 'newuser@test.com',
          password: bcrypt.hashSync('newpassword', 8)
        }
      };
      User.create(userData, done);
    });

    it('should be able to sign in', (done) => {
      request('localhost:3000')
        .get('/api/signin')
        .auth('newuser@test.com', 'newpassword')
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          done();
        });
    });

    it('should be refuse access with incorrect password', (done) => {
      request('localhost:3000')
        .get('/api/signin')
        .auth('newuser@test.com', 'wrongpassword')
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(401);
          expect(res.body.msg).to.eql('invalid password');
          done();
        });
    });

    it('should be refuse access with invalid username', (done) => {
      request('localhost:3000')
        .get('/api/signin')
        .auth('wrongemail@test.com', 'helloworld')
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(401);
          expect(res.body.msg).to.eql('user does not exist');
          done();
        });
    });
  });
});
