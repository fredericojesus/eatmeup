(function () {
    'use strict';

    angular
        .module('app.auth')
        .factory('User', user);

    user.$inject = ['$resource'];
    /*@ngInject*/
    function user($resource) {
        var baseUrl = '/api/user';
        var userResource = $resource(baseUrl + '/:username', { username: '@username' }, {
            update: { method: 'PUT', isArray: false },
        });

        userResource.prototype.isAdmin = function () {
            return this.roles && this.roles.indexOf('admin') > -1;
        };

        return userResource;
    }

})();
