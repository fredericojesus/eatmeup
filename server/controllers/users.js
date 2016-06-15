'use strict';

var User = require('../models/user.js');

module.exports = {
    
    getCurrentUser: getCurrentUser,
    updateUser: updateUser

};

function getCurrentUser(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(403).end();
    }

    res.status(200).send(req.user);
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
