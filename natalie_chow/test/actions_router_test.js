const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;

const mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/salem_test';
const server = require(__dirname + '/../server');

describe('The action router', () => {
  before(() => {
    server.listen(3000);
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      server.close();
      done();
    });
  });

  it('should check the size of population', (done) => {
    request('localhost:3000')
      .get('/census')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys(['towns', 'mafias', 'totalPopulation']);
        done();
      });
  });

  it('should be able to wipe the database', (done) => {
    request('localhost:3000')
      .get('/wipe')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.msg).to.eql('wipe successful');
        done();
      });
  });

  it('should be able to generate some characters', (done) => {
    request('localhost:3000')
      .get('/newgame')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.msg).to.eql('new game generation successful');

        request('localhost:3000')
          .get('/census')
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res.body.totalPopulation).to.be.above(0);
            done();
          });
      });
  });
});
