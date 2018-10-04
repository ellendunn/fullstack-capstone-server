'use strict'
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose')
const passport = require('passport');

mongoose.Promise = global.Promise;

const { router: usersRouter } = require('./routes/users-router');
const { router: authRouter } = require('./routes/auth-router');
const { router: foodItemsRouter } = require('./routes/food-items-router');
const { router: recipesSearchRouter } = require('./routes/recipes-search-router');
const { localStrategy, jwtStrategy } = require('./auth/strategies');

const { FoodItem } = require('./models/food-item');
const { User } = require('./models/user');
const { PORT, DATABASE_URL } = require('./config')

const app = express();
app.use(express.json());

const cors = require('cors');

app.use(
    cors({
        origin: 'https://kitchensmart.herokuapp.com/'
    })
);

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
	if (req.method ==='OPTIONS') {
		return res.sendStatus(204);
	}
	next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use('/api/food-items', foodItemsRouter);
app.use('/api/recipes', recipesSearchRouter)

const jwtAuth = passport.authenticate('jwt', { session: false });

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

let server;

function runServer(databaseUrl, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
