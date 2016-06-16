(function () {
    'use strict';

    angular
        .module('app.auth')
        .factory('authService', authService);

    authService.$inject = ['$http', '$q', 'User'];
    /*@ngInject*/
    function authService($http, $q, User) {
        var _currentUser;

        var service = {
            currentUser: currentUser,
            getCurrentUser: getCurrentUser,
            isAuthenticated: isAuthenticated,
            isAuthorized: isAuthorized,
            authenticateUser: authenticateUser,
            signupUser: signupUser,
            logout: logout
        };

        return service;

        function currentUser() {
            return _currentUser;
        }

        function getCurrentUser() {
            var dfd = $q.defer();
            
            if (!!_currentUser) {
                dfd.resolve(_currentUser);
            } else {
                $http.get('/api/user')
                    .then(function (response) {
                        _currentUser = new User();
                        angular.extend(_currentUser, response.data);
                        dfd.resolve(_currentUser);
                    }).catch(function (response) {
                        dfd.reject(response.data);
                    });
            }
            
            return dfd.promise;
        }

        function isAuthenticated() {
            return !!_currentUser;
        }

        function isAuthorized(role) {
            return !!_currentUser && _currentUser.roles.indexOf(role) > -1;
        }

        function authenticateUser(username, password) {
            var dfd = $q.defer();
            
            $http.post('/api/login', {
                username: username,
                password: password
            }).then(function (response) {
                _currentUser = new User();
                angular.extend(_currentUser, response.data);
                dfd.resolve();
            }).catch(function (response) {
                dfd.reject(response.data);
            });
            
            return dfd.promise;
        }
        
        function signupUser(username, password) {
            var dfd = $q.defer();
            
            $http.post('/api/signup', {
                username: username,
                password: password
            }).then(function (response) {
                _currentUser = new User();
                angular.extend(_currentUser, response.data);
                dfd.resolve();
            }).catch(function (response) {
                dfd.reject(response.data);
            });
            
            return dfd.promise;
        }
        
        function logout() {
            var dfd = $q.defer();
            
            $http.get('/api/logout')
                .then(function (response) {
                    _currentUser = undefined;
                    dfd.resolve();
                }).catch(function (response) {
                    console.log(response.data);
                    dfd.reject(response.data);
                });
            
            return dfd.promise;
        }
    }

})();
