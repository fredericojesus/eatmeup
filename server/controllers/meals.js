'use strict';

var Meal = require('../models/meal.js');

module.exports = {

    getMeals: getMeals,
    createMeal: createMeal,
    updateMeal: updateMeal,
    deleteMeal: deleteMeal

};

function getMeals(req, res, next) {
    Meal.find()
        .sort({ date: 1, time: 1 })
        .exec(
            function (err, meals) {
                res.status(200).send(meals);
            }
        );
}

function createMeal(req, res, next) {
    var meal = new Meal({
        meal: req.body.meal,
        creator: req.user._id,
        description: req.body.description,
        calories: req.body.calories,
        date: req.body.date,
        time: req.body.time
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
    Meal.findById(req.body._id, function (err, meal) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }

        meal.meal = req.body.meal;
        meal.description = req.body.description;
        meal.calories = req.body.calories;
        meal.date = req.body.date;
        meal.time = req.body.time;

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
    Meal.findByIdAndRemove(req.body._id, function (err, meal) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }

        res.status(200).send();
    });
}