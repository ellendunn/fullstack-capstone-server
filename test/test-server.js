const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const {app, runServer, closeServer} = require('../server');
const {JWT_SECRET, TEST_DATABASE_URL} = require('../config');
const {User} = require('../models/user')
const {FoodItem} = require('../models/food-item')

const should = chai.should();
chai.use(chaiHttp);

describe('API', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL, 8081)
  });

  after(function() {
    return closeServer()
  })

  it('should send 404 for nonexistent endpoint', function() {
    return chai.request(app)
      .get('/api')
      .then(function(res) {
        res.should.have.status(404);
        res.should.be.json;
      });
  });
});
