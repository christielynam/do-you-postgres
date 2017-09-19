const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../app');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('POST /api/v1/users', () => {
  it('should retrieve a user', (done) => {
    chai.request(server)
    .post('/api/v1/users')
    .send({
      email: 'christielynam@gmail.com',
      password: 'auburn'
    })
    .end((err , response) => {
      response.should.have.a.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(1);
      response.body[0].should.have.property('id');
      response.body[0].id.should.equal(1);
      response.body[0].should.have.property('name');
      response.body[0].name.should.equal('Christie Lynam');
      response.body[0].should.have.property('email');
      response.body[0].email.should.equal('christielynam@gmail.com');
      response.body[0].should.have.property('password');
      response.body[0].password.should.equal('auburn');
      response.body[0].should.have.property('created_at');
      response.body[0].should.have.property('updated_at');
      done();
    })
  })

    it('should not retrieve a user without sufficient data passed in', (done) => {
      chai.request(server)
      .post('/api/v1/users')
      .send({
        email: 'christielynam@gmail.com',
        password: ''
      })
      .end((err, response) => {
        response.should.have.status(404)
        response.body.error.should.equal('Invalid email or password')
        done();
      })
    })

})

  describe('POST /api/v1/users/new', () => {
    it.skip('should create a new user', (done) => {
      chai.request(server)
      .post('/api/v1/users/new')
      .send({
        name: 'Gina',
        email: 'gina@gina.com',
        password: 'gina'
      })
      .end((err , response) => {
        response.should.have.a.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Gina');
        response.body[0].should.have.property('email');
        response.body[0].email.should.equal('gina@gina.com');
        response.body[0].should.have.property('password');
        response.body[0].password.should.equal('gina');
        response.body[0].should.have.property('created_at');
        response.body[0].should.have.property('updated_at');
        done();
      })
    })

    it('should not add user to database if missing sufficient params', (done) => {
      chai.request(server)
      .post('/api/v1/users/new')
      .send({
        name: '',
        email: 'louisa@louisa.com',
        password: ''
      })
      .end((err, response) => {
        response.should.have.status(422)
        response.body.error.should.equal('Missing required information to complete request')
        done();
      })
    })

})

describe('POST /api/v1/results', () => {
  it.skip('should store a test id in the database', (done) => {
    chai.request(server)
    .post('/api/v1/results')
    .send({
      test_id: 'd590982a-95d6-447d-9a3a-96970748cdb7',
      deck_id: 'persuasion',
      user_id: '6'
    })
    .end((err , response) => {
      response.should.have.a.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      // response.body.length.should.equal(1);
      response.body[0].should.have.property('id');
      response.body[0].should.have.property('test_id');
      response.body[0].test_id.should.equal('d590982a-95d6-447d-9a3a-96970748cdb7');
      response.body[0].should.have.property('deck_id');
      response.body[0].deck_id.should.equal('persuasion');
      response.body[0].should.have.property('user_id');
      response.body[0].user_id.should.equal(6);
      response.body[0].should.have.property('created_at');
      response.body[0].should.have.property('updated_at');
      done();
    })
  })

  it('should not store test if insufficient information is supplied', (done) => {
    chai.request(server)
    .post('/api/v1/results')
    .send({
      test_id: '',
      deck_id: 'core',
      user_id: '4'
    })
    .end((err, response) => {
      response.should.have.status(422)
      response.body.error.should.equal('Missing required information to complete request')
      done();
    })
  })

})

describe('GET /api/v1/results/:id', () => {
  it('should retrieve all tests linked to user id supplied in request', (done) => {
    chai.request(server)
    .get('/api/v1/results/2')
    .end((err , response) => {
      response.should.have.a.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      // response.body.length.should.equal(1);
      // response.body[0].should.have.property('id');
      // response.body[0].id.should.equal(127);
      // response.body[0].should.have.property('test_id');
      // response.body[0].test_id.should.equal('7c3f284b-a4f3-408c-83b6-e6ba5f8f9d88');
      // response.body[0].should.have.property('deck-id');
      // response.body[0].deck_id.should.equal('career-deck');
      // response.body[0].should.have.property('user_id');
      // response.body[0].user_id.should.equal('2');
      // response.body[0].should.have.property('created_at');
      // response.body[0].should.have.property('updated_at');
      done();
    })
  })

  it('should not retrieve any tests if wrong endpoint is passed in', (done) => {
    chai.request(server)
    .get('/api/v1/results/500')
    .end((err, response) => {
      response.should.have.status(404)
      response.body.error.should.equal('No assessments for this user were found')
      done();
    })
  })
})
