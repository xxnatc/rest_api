const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/salem_test';
const server = require(__dirname + '/../server');
const Mafia = require(__dirname + '/../models/mafia');
const User = require(__dirname + '/../models/user');

process.env.APP_SECRET = 'testsecret';

describe('The mafia api', () => {
  before((done) => {
    server.listen(3000);

    var userData = {
      username: 'newuser@test.com',
      auth: { email: 'newuser@test.com', password: bcrypt.hashSync('newpassword', 8) }
    };
    User.create(userData, (err, data) => {
      this.testUser = data;
      this.token = jwt.sign({ id: this.testUser._id }, process.env.APP_SECRET);
      done();
    });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      server.close();
      done();
    });
  });

  it('should be able to retrieve all mafias', (done) => {
    request('localhost:3000')
      .get('/api/mafias')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should be able to create a mafia', (done) => {
    request('localhost:3000')
      .post('/api/mafias')
      .set('Token', this.token)
      .send({name: 'random mafia'})
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.name).to.eql('random mafia');
        expect(res.body).to.have.property('_id');
        done();
      });
  });

  it('should reject a post request without auth', (done) => {
    request('localhost:3000')
      .post('/api/mafias')
      .send({name: 'random mafia'})
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(401);
        expect(res.body.msg).to.eql('invalid token');
        done();
      });
  });

  describe('requests that require a populated DB', () => {
    beforeEach((done) => {
      Mafia.create({name: 'test mafia'}, (err, data) => {
        this.testMafia = data;
        done();
      });
    });

    it('should be able to retrieve a specific mafia', (done) => {
      request('localhost:3000')
        .get('/api/mafias/' + this.testMafia._id)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body).to.be.an('array');
          expect(res.body[0].name).to.eql('test mafia');
          done();
        });
    });

    it('should be able to update a specific mafia', (done) => {
      request('localhost:3000')
        .put('/api/mafias/' + this.testMafia._id)
        .set('Token', this.token)
        .send({name: 'new mafia'})
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.eql('update successful');
          done();
        });
    });

    it('should reject a put request without auth', (done) => {
      request('localhost:3000')
        .put('/api/mafias/' + this.testMafia._id)
        .send({name: 'new mafia'})
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(401);
          expect(res.body.msg).to.eql('invalid token');
          done();
        });
    });

    it('should be able to delete a specific mafia', (done) => {
      request('localhost:3000')
        .delete('/api/mafias/' + this.testMafia._id)
        .set('Token', this.token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.eql('delete successful');
          done();
        });
    });

    it('should reject a delete request without auth', (done) => {
      request('localhost:3000')
        .delete('/api/mafias/' + this.testMafia._id)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(401);
          expect(res.body.msg).to.eql('invalid token');
          done();
        });
    });
  });
});
