const {FoodItem} = require('../models/food-item')
const {User} = require('../models/user')

exports.getFoodItems = (req, res) => {
	console.log('getting foods')
	FoodItem
    .find({user: req.user.id})
		.then(foods => res.json(foods.map(food => food.serialize())))
		.then(res => console.log(res))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal Server Error 1'})
    })
}


exports.postFoodItem = (req, res) => {
	console.log(req.body)
  User
	.findById(req.user.id)
  .then(user => {
    if (user) {
      FoodItem.create({
				food: req.body.food,
				container: req.body.container})
        // .then(food => {
        //   return FoodItem.findById(food._id)
        // })
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
