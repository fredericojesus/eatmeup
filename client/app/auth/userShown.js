(function () {
    'use strict';

    angular
        .module('app.auth')
        .factory('userShown', userShown);

    userShown.$inject = [];
    /*@ngInject*/
    function userShown() {
        var _user;

        var service = {
            getUserShown: getUserShown,
            setUserShown: setUserShown,
            setUserShownCalories: setUserShownMaximumCalories
        };

        return service;

        function getUserShown() {
            console.log(_user);
            return _user;
        }

        function setUserShown(userShown) {
            _user = userShown;
        }

        function setUserShownMaximumCalories(maximumCaloriesPerDay) {
            _user.maximumCaloriesPerDay = maximumCaloriesPerDay;
        }
    }

})();