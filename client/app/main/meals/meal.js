(function () {
    'use strict';

    angular.module('app.meals')
        .factory('Meal', meal);

    meal.$inject = ['$resource'];
    /*@ngInject*/
    function meal($resource) {
        var baseUrl = '/api/meals';
        var mealResource = $resource(baseUrl + '/:_id', { _id: '@_id' }, {
            update: { method: 'PUT', isArray: false },
        });

        mealResource.prototype.getDate = getDate;

        return mealResource;

        function getDate() {
            var date = new Date(this.date);
            var hours = date.getHours();
            var minutes = date.getMinutes();

            return date.toLocaleDateString() + ' at ' + hours + 'H';
        }
    }
})();