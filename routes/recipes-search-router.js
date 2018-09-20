const router = require('express').Router();
const controllers = require('../controllers/recipes-search')

router.post('/', controllers.postSearchItems)

module.exports = { router }
