const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const jwt = require('jsonwebtoken');

const {app, runServer, closeServer} = require('../server')
const {JWT_SECRET, TEST_DATABASE_URL} = require('../config');
const {FoodItem} = require('../models/food-item')
const {User} = require('../models/user');

const expect = chai.expect;
chai.use(chaiHttp);

const firstName = 'First';
const lastName = 'Last';
const username = 'username';
const password='password';
let id;

describe('FoodItems API resource', function() {

	before(function() {
		return runServer(TEST_DATABASE_URL, 8081);
	});

	// beforeEach(function() {
	// 	return User.hashPassword(password)
	// 		.then(pswd => {
	// 			return User.create({
	// 				firstName,
	// 				lastName,
	// 				username,
	// 				password: pswd
	// 			});
	// 		})
	// 		.then(user => {
	// 			id: user.id
	// 		})
	// })

	afterEach(function() {
		return User.remove({})
	})

	after(function() {
		return closeServer()
	})

	describe('POST to register endpoint', function() {
		it('should return jwt auth token', function() {
			return chai
				.request(app)
				.post('/api/users')
				.send({firstName, lastName, username, password})
				.then(res => {
					expect(res).to.have.status(201);
					expect(res.body).to.be.an('object');
					const {id} = res.body
					expect(res.body).to.be.deep.equal({
						id,
						firstName,
						lastName,
						username
					});
				});
		});
	});

})
