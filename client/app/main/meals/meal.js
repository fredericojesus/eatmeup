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
            var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
            var minutes = date.getMinutes();
            var amPm = hours > 12 ? 'pm' : 'am';

            return date.toDateString() + ' at ' + hours + amPm;
        }
    }
})();