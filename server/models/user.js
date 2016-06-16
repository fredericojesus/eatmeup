var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var mealType = new Schema({
    type: String,
    timeFrom: Number,
    timeTo: Number
});

//schema for user model
var userSchema = Schema({
    username: String,
    alias: String,
    password: String,
    roles: [String],
    maximumCaloriesPerDay: { type: Number, default: 3000 },
    mealTypes: [mealType],
    createdOn: { type: Date, default: Date.now }
});

userSchema.pre('save', function (next) {
    this.roles = [];
    this.roles.push('regular');

    var breakFast = {
        type: 'Breakfast',
        timeFrom: 8,
        timeTo: 11
    };
    var lunch = {
        type: 'Lunch',
        timeFrom: 12,
        timeTo: 15
    };
    var dinner = {
        type: 'Dinner',
        timeFrom: 19,
        timeTo: 22
    };

    this.mealTypes = [];
    this.mealTypes.push(breakFast, lunch, dinner);

    next();
});

//methods
//generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//checking if password is valid
userSchema.methods.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

//checking if a user has a role
userSchema.methods.hasRole = function (role) {
    return this.roles.indexOf(role) > -1;
};

module.exports = mongoose.model('User', userSchema);