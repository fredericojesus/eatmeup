'use strict';

var mongoose = require('mongoose');
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

    var dateFrom = new Date(2016, 0, 1);
    var dateTo = new Date();
    dateTo.setHours(23);
    dateTo.setMinutes(99);
    var timeFrom = 0;
    var timeTo = 23;
    if (req.query.dateTo && req.query.dateFrom && req.query.timeFrom && req.query.timeTo) {
        dateFrom = new Date(req.query.dateFrom);
        dateTo = new Date(req.query.dateTo);
        dateTo.setHours(23);
        dateTo.setMinutes(99);
        timeFrom = parseInt(req.query.timeFrom);
        timeTo = parseInt(req.query.timeTo);
    }

    Meal.aggregate({
        $match: {
            creator: mongoose.Types.ObjectId(req.query.userId),
            date: {
                $gte: dateFrom,
                $lte: dateTo
            },
            time: {
                $gte: timeFrom,
                $lte: timeTo
            }
        }
    }, {
        $sort: {
            date: -1,
            time: -1
        }
    }, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }

        if (result.length) {
            return res.status(200).send(result);
        }

        console.log('No meals found between dates from and to...')
        res.status(200).send();
    });
}

function createMeal(req, res, next) {
    console.log('Creating meal...');

    var meal = new Meal({
        name: req.body.name,
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
    console.log('Retrieving calories consumed today by ' + req.params.userId);

    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);

    Meal.aggregate({
        $match: {
            creator: mongoose.Types.ObjectId(req.params.userId),
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

        console.log('No meals found today...')
        res.status(200).send();
    });
}