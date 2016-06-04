var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('./models/user');

module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    }, function (req, username, password, done) {
        // if (username) {
            // Use lower-case usernames to avoid case-sensitive username matching
            var alias = username.toLowerCase();
        // }

        // asynchronous
        process.nextTick(function () {
            User.findOne({'alias': alias}, function (err, user) {
                // if there are any errors, return the error
                if (err) {
                    return done(err);
                }

                // if no user is found, return the message
                if (!user) {
                    return done(null, {error: 'No user found.'});
                }

                if (!user.password || !user.validPassword(password)) {
                    return done(null, {error: 'Oops! Wrong password.'});
                }

                // all is well, return user
                else {
                    return done(null, user);
                }
            });
        });
    }));

    // =========================================================================
    // LOCAL SIGNUP =============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password
        usernameField: 'username',
        passwordField: 'password',
        // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        passReqToCallback: true
    }, function (req, username, password, done) {
        // use lower-case usernames to avoid case-sensitive username matching
        var alias = username.toLowerCase();

        // asynchronous
        process.nextTick(function () {
            // if the user is not already logged in:
            if (!req.user) {
                User.findOne({'alias': alias}, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    
                    // check to see if theres already a user with that username
                    if (user) {
                        return done(null, {error: 'That username is already taken.'});
                    } 
                    
                    // create the user
                    else {
                        var newUser = new User();
                        newUser.auth.local.alias = req.body.username;
                        newUser.auth.local.username = req.body.username.toLowerCase();
                        newUser.auth.local.password = newUser.generateHash(password);
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            } 
            
            // if the user is logged in but has no local account...
            else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, req.user);
            }
        });
    }));
};