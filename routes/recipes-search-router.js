const router = require('express').Router();
const controllers = require('../controllers/recipes-search')

router.post('/', controllers.getRecipesByIngredients)
router.get('/:id', controllers.getRecipeById)

module.exports = { router }
