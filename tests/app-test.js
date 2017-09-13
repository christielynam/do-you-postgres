const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../app');

chai.use(chaiHttp);

describe('API Routes', () => {

  afterEach(() => {
    server.locals.users = [];
  })
})