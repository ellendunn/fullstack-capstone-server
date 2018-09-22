const {FoodItem} = require('../models/food-item')
const {User} = require('../models/user')

exports.getFoodItems = (req, res) => {
	FoodItem.find()
    // .find({user: req.user.id})
		.then(foods => {
			res.json({
				fooditems: foods.map(
					(food) => food.serialize())
			})
		})
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal Server Error 1'})
    })
}

exports.postFoodItem = (req, res) => {
  User
	.findById(req.user.id)
  .then(user => {
    if (user) {
      FoodItem.create({
				food: req.body.food,
				container: req.body.container})
        .then(food => {
          res.status(201).json(food.serialize())
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({message: 'Internal Server Error 2'})
        })
    }
  })
}

exports.deleteFoodItem = (req, res) => {
	console.log(req.params)
	FoodItem
	.findByIdAndRemove(req.params.id)
	.then(item => res.status(204).end(0))
	.catch(err => res.status(500).json({message: 'Internal Server Error 3'}))
}
