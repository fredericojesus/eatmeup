(function () {
    'use strict';
    
    angular.module('app.meals')
        .factory('meals', meals);
        
    meals.$inject = ['$resource'];
    /*@ngInject*/
    function meals($resource) {
        var baseUrl = '/api/meals';
        var postResource = $resource(baseUrl + '/:_id', {_id: '@_id'}, {
            update: {method: 'PUT', isArray: false},
        });


    }
})();