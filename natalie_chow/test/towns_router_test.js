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
  before(() => {
    server.listen(3000);
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      server.close();
      done();
    });
  });

  it('should be able to retrieve all towns', (done) => {
    request('localhost:3000')
      .get('/api/towns')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should be able to create a town', (done) => {
    request('localhost:3000')
      .post('/api/towns')
      .send({name: 'random town'})
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.name).to.eql('random town');
        expect(res.body).to.have.property('_id');
        done();
      });
  });

  describe('requests that require a populated DB', () => {
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

    it('should be able to update a specific town', (done) => {
      request('localhost:3000')
        .put('/api/towns/' + this.testTown._id)
        .send({name: 'new test town'})
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.eql('update successful');
          done();
        });
    });

    it('should be able to delete a specific town', (done) => {
      request('localhost:3000')
        .delete('/api/towns/' + this.testTown._id)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.eql('delete successful');
          done();
        });
    });
  });
});
