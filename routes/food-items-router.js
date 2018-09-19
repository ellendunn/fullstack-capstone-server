const router = require('express').Router();
const controllers = require('../controllers/food-items')

router.get('/', controllers.getFoodItems)
router.post('/', controllers.postFoodItem)

module.exports = {router}
