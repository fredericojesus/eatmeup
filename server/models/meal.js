var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema for meal model
var mealSchema = Schema({
    name: String,
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    description: String,
    calories: Number,
    date: String,
    time: String,
    createdOn: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Meal', mealSchema);