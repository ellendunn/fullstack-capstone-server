const router = require('express').Router();
const passport = require('passport');
const controllers = require('../controllers/food-items');
const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/', jwtAuth, controllers.getFoodItems)
router.post('/', jwtAuth, controllers.postFoodItem)
router.delete('/:id', jwtAuth, controllers.deleteFoodItem)

module.exports = {router}
