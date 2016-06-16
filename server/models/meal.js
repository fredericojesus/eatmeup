var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema for meal model
var mealSchema = Schema({
    name: String,
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    description: String,
    calories: Number,
    date: Date,
    time: Number //number between 0 and 23
    // createdOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meal', mealSchema);