'use strict';

var Meal = require('../models/meal.js');

module.exports = {

    getMeals: getMeals,
    createMeal: createMeal,
    updateMeal: updateMeal,
    deleteMeal: deleteMeal,
    getTodayUserCalories: getTodayUserCalories

};

function getMeals(req, res, next) {
    console.log('Retrieving meals...');

    Meal.find({creator: req.user._id})
        .sort({ date: 1 })
        .exec(
            function (err, meals) {
                res.status(200).send(meals);
            }
        );
}

function createMeal(req, res, next) {
    console.log('Creating meal...');

    var meal = new Meal({
        name: req.body.name,
        creator: req.user._id,
        description: req.body.description,
        calories: req.body.calories,
        date: req.body.date,
    });

    meal.save(req, function (err, meal) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }
        res.status(200).send(meal);
    });
}

function updateMeal(req, res, next) {
    console.log('Updating meal...');

    Meal.findById(req.body._id, function (err, meal) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }

        meal.name = req.body.name;
        meal.description = req.body.description;
        meal.calories = req.body.calories;
        meal.date = req.body.date;

        meal.save(function (err, meal) {
            if (err) {
                console.log(err);
                return res.status(500).end();
            }
            res.status(200).send(meal);
        });
    });
}

function deleteMeal(req, res, next) {
    console.log('Deleting meal...');

    Meal.findByIdAndRemove(req.params._id, function (err, meal) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }

        res.status(200).send();
    });
}

function getTodayUserCalories(req, res, next) {
    console.log('Retrieving calories consumed today by ' + req.user.username);

    var start = new Date();
    start.setHours(0,0,0,0);
    var end = new Date();
    end.setHours(23,59,59,999);

    Meal.aggregate({
        $match: {
            creator: req.user._id,
            date: { 
                $gte: start,
                $lte: end 
            } 
        } 
    }, {
        $group: {
            _id: null,
            totalCalories: { 
                $sum: "$calories"
            }
        }
    }, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }

        if (result.length) {
            console.log(result[0].totalCalories);
            return res.status(200).send(result[0]);
        }

        res.status(200).send();
    })
}