const {FoodItem} = require('../models/food-item')

exports.getFoodItems = (req, res) => {
	console.log('getting foods')
	FoodItem
    .find({user: req.user._id})
		.then(foods => res.json(foods.map(food => food.serialize())))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal Server Error 1'})
    })
}


exports.postFoodItem = (req, res) => {
  User.findById(req.user._id)
  .then(user => {
    if (user) {
      FoodItem.create({food: req.body})
        .then(food => {
          return FoodItem.findById(foodItem._id)
        })
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
