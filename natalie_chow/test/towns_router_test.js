const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const mongoose = require('mongoose');

process.env.MONGOLAB_URI = 'mongodb://localhost/salem_test';
const server = require(__dirname + '/../server');
const Town = require(__dirname + '/../models/town');

describe('The towns api', () => {
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  it('should be able to retrieve all towns', (done) => {
    request('localhost:3000')
      .get('/api/towns')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  describe('api that requires a town in DB', () => {
    beforeEach((done) => {
      Town.create({name: 'test town'}, (err, data) => {
        this.testTown = data;
        done();
      });
    });

    it('should be able to retrieve a specific town', (done) => {
      request('localhost:3000')
        .get('/api/towns/' + this.testTown._id)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body).to.be.an('array');
          expect(res.body[0].name).to.eql('test town');
          done();
        });
    });
  });
});
