var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

//schema for user model
var userSchema = Schema({
    username: String,
    alias: String,
    password: String,
    roles: [String],
    createdOn: { type: Date, default: Date.now }
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