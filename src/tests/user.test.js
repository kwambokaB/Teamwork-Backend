import chai from 'chai';
import { describe } from 'mocha';
import chaiHttp from 'chai-http';
import server from '../server';
// import { response } from 'express';

// const baseUrl = '/api/v1/auth';

chai.should();
chai.use(chaiHttp);

describe('User API', () => {
  // test login
  describe('login user', (done) => {
    chai.request(server)
      .post('/api/v1/auth/login')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.a('array');
        done();
      });
  });

  // test create user
});
