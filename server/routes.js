var router = require('express').Router();
var passport = require('passport');
var four0four = require('./utils/404')();
var data = require('./data');

router.post('/login', login);
router.post('/signup', signup);
router.get('/logout', logout);
router.get('/user', getCurrentUser);
router.get('/user/status', getCurrentUserStatus);

router.get('/people', getPeople);
router.get('/person/:id', getPerson);

router.get('/*', four0four.notFoundMiddleware);

module.exports = router;

function login(req, res, next) {
    passport.authenticate('login', function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }
        if (user.error) {
            return res.status(403).send(user.error);
        }

        console.log('Logging in...');
        res.send(req.user);
    })(req, res, next);
}

function signup(req, res, next) {
    console.log('Creating new user...');
    passport.authenticate('signup', function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }
        if (user.error) {
            console.log(user.error);
            return res.status(403).send(user.error);
        }

        console.log('User created, logging in now...');
        return req.logIn(user, function (err) {
            if (err) {
                console.log(err);
                return res.status(500).end();
            }
            res.send(req.user);
        });
    })(req, res, next);
}

function getCurrentUser(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(403).end();
    }

    res.status(200).send(req.user);
}

function getCurrentUserStatus(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(403).end();
    }

    res.status(200).send();
}

function logout(req, res, next) {
    req.logout();
    console.log('User logged out');
    res.status(200).send(true);
}

function getPeople(req, res, next) {
    res.status(200).send(data.people);
}

function getPerson(req, res, next) {
    var id = +req.params.id;
    var person = data.people.filter(function (p) {
        return p.id === id;
    })[0];

    if (person) {
        res.status(200).send(person);
    } else {
        four0four.send404(req, res, 'person ' + id + ' not found');
    }
}

// route middleware to ensure user is authenticated
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}