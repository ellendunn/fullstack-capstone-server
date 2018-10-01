const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const {app, runServer, closeServer} = require('../server')
const {JWT_SECRET, TEST_DATABASE_URL} = require('../config');
const {FoodItem} = require('../models/food-item')
const {User} = require('../models/user');

const expect = chai.expect;
chai.use(chaiHttp);

function seedFoodItems(userId) {
	const seedData = [];
	for(i=1; i<=1; i++){
		seedData.push(generateFoodItems(userId))
	}
	return FoodItem.insertMany(seedData)
}

function generateFoodItems(userId) {
	return {
		food: faker.lorem.word,
    container: faker.lorem.word,
    user: userId
	}
}

function tearDownDb() {
	return mongoose.connection.dropDatabase()
}

const username='username';
const password='password';
let jwt, userId

describe('FoodItems API resource', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL, 8081);
	});

	beforeEach(function() {
		return User.hashPassword(password)
			.then(password => {
				return User.create({
					username,
					password
				});
			})
			.then(user => {
				userId = user._id;
				return chai.request(app)
					.post('/api/auth/login')
					.send({username, password})
			})
			.then(res => {
				jwt = res.body.authToken
				return seedFoodItems(userId)
			})
	})

	afterEach(function() {
		return User.remove({})
	})

	after(function() {
		return closeServer()
	})


	describe('GET foodItems endpoint', function() {
		it('should return all food items', function() {
			let res;
			return chai.request(app)
				.get('/api/food-items')
				.set('Authorization', `Bearer ${jwt}`)
				.then(function(res) {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body.fooditems).to.have.lengthOf.at.least(1);
					res.body.fooditems.forEach(function(foodItem) {
						expect(foodItem).to.be.a('object');
						expect(foodItem).to.include.keys(
							'food', 'container' )
						});
						resFood = res.body.fooditems[0];
						return FoodItem.findById(resFood.id);
				})
				.then(foodItem => {
					expect(resFood.id).to.equal(foodItem.id);
					expect(resFood.food).to.equal(foodItem.food);
					expect(resFood.container).to.equal(foodItem.container)
				});
		});
	});

	describe('POST request endpoint', function() {
		it('should add a new food item', function() {
			const newFood = {
				'food': 'tomato',
				'container': 'pantry'
			}

			return chai.request(app)
				.post('/api/food-items')
				.set('Authorization', `Bearer ${jwt}`)
				.send(newFood)
				.then(function(res) {
					expect(res).to.have.status(201);
					expect(res).to.be.json;
					expect(res.body).to.be.a('object');
					expect(res.body).to.include.keys(
						'food', 'container');
					expect(res.body.id).to.not.be.null;
					expect(res.body.food).to.equal(newFood.food);
					expect(res.body.container).to.equal(newFood.container)
					return FoodItem.findById(res.body.id)
				})
				.then(foodItem => {
					expect(foodItem.food).to.equal(newFood.food);
					expect(foodItem.container).to.equal(newFood.container)
				});
		});
	});

	describe('DELETE request endpoint', function() {
		it('should delete a food item by id', function() {
			let foodItem;
			return FoodItem
				.findOne()
				.then(function(_foodItem){
					foodItem = _foodItem;
					return chai.request(app)
					.delete(`/api/food-items/${foodItem.id}`)
					.set('Authorization', `Bearer ${jwt}`)
				})
				.then(function(res) {
					expect(res).to.have.status(204);
					return FoodItem.findById(foodItem.id)
				})
				.then(function(_foodItem) {
					expect(_foodItem).to.be.null
				})
		})
	})

})
