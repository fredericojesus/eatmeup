'use strict';

var User = require('../models/user.js');

module.exports = {
    
    getCurrentUser: getCurrentUser,

};

function getCurrentUser(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(403).end();
    }

    res.status(200).send(req.user);
}
