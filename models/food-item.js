'use strict'

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const foodItemSchema = mongoose.Schema({
	food: {type: String, required: true},
  container: {type: String, required: true},
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
})

foodItemSchema.pre("find", function(next) {
  this.populate("user");
  next()
})

foodItemSchema.pre("findOne", function(next) {
  this.populate("user");
  next()
})

foodItemSchema.methods.serialize = function() {
	return {
		id: this._id,
		food: this.food,
    container: this.container,
    user: this.user
	}
}

const FoodItem = mongoose.model('FoodItem', foodItemSchema)

module.exports = {FoodItem}
