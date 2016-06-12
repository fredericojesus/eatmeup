(function() {
    'use strict';

    angular
        .module('app.meals')
        .directive('meal', meal);

    function meal() {
        return {
            restrict: 'E',
            templateUrl: 'app/main/meals/meal.html'
        };
    }

})();