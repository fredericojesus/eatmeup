var router = require('express').Router();
var four0four = require('./utils/404')();

//controllers
var auth = require('./controllers/auth.js');
var users = require('./controllers/users.js');
var meals = require('./controllers/meals.js');

var data = require('./data');

//AUTH ROUTES
router.post('/login', auth.login);
router.post('/signup', auth.signup);
router.get('/logout', auth.logout);

//USERS ROUTES
router.get('/user', users.getCurrentUser);
router.get('/user/:username', isAuthenticated, users.getUserByUsername);
router.put('/user', isAuthenticated, users.updateUser);

//MEALS ROUTES
router.get('/meals', isAuthenticated, meals.getMeals);
router.post('/meals', isAuthenticated, meals.createMeal);
router.put('/meals/:_id', isAuthenticated, meals.updateMeal);
router.delete('/meals/:_id', isAuthenticated, meals.deleteMeal);
router.get('/meals/todayCalories/:userId', isAuthenticated, meals.getTodayUserCalories);

//FOUR0FOUR
router.get('/*', four0four.notFoundMiddleware);

module.exports = router;

// route middleware to ensure user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}