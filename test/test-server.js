const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const {app, runServer, closeServer} = require('../server');
const {JWT_SECRET, TEST_DATABAS_URL} = require('../config');
const {User} = require('../models/user')
const {FoodItem} = require('../models/food-item')

const should = chai.should();
chai.use(chaiHttp);

describe('API', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL, 8080)
  });

  after(function() {
    return closeServer()
  })

  it('should exist', function() {
    return chai.request(app)
      .get('/api/')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
      });
  });
});
