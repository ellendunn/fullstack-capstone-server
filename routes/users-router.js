const router = require('express').Router()
const controllers = require('../controllers/users')
const {User} = require('../models/user')

router.post('/', controllers.postUser);

router.get('/', (req, res) => {
  return User.find()
    .then(users => {
      console.log(users)
      return res.json(users.map(user => user.serialize()))
    })
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router}
