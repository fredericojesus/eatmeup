'use strict';

var User = require('../models/user.js');

module.exports = {
    
    getCurrentUser: getCurrentUser,
    getUserByUsername: getUserByUsername,
    updateUser: updateUser

};

function getCurrentUser(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(403).end();
    }

    res.status(200).send(req.user);
}

function getUserByUsername(req, res, next) {
    console.log('Getting user by username (' + req.params.username + ')...');

    User.find({username: req.params.username}, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }

        if (user) {
            res.status(200).send(user[0]);
        } else {
            res.status(403).end();
        }

    });
}

function updateUser(req, res, next) {
    console.log('Updating user...');

    User.findById(req.body._id, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }

        user.maximumCaloriesPerDay = req.body.maximumCaloriesPerDay;

        user.save(function (err, user) {
            if (err) {
                console.log(err);
                return res.status(500).end();
            }
            res.status(200).send(user);
        });
    });
}
