(function () {
    'use strict';

    angular
        .module('user')
        .factory('userFactory', ['$http', 'persistenceFactory', userFactory]);

    function userFactory($http, persistence) {
        function getUser() {
            var promise = $http.get('/user/me');
            promise.success(sucessCb);
            function sucessCb(data) {
                persistence.set('user', data);
            }
            return promise;
        }

        function register(newUser) {
            return $http.post('/user/register', newUser);
        }

        function login(userStub) {
            return $http.post('/user/login', userStub);
        }

        return {
            getUser: getUser,
            register: register,
            login: login
        };
    }
})();