(function () {
    'use strict';

    angular
        .module('user')
        .factory('userFactory', ['$http', 'persistenceFactory', '$window', '$httpParamSerializer', userFactory]);

    function userFactory($http, persistence, $window, $httpParamSerializer) {
        function getUser() {
            var promise = $http.get('/user/me');
            promise.success(function (data) {
                persistence.set('user', data);
            });

            return promise;
        }

        function login() {
            var host = 'https://login.eveonline.com/oauth/authorize?';
            var cb = 'http://localhost:8082/#/crest/callback';
            var params = {
                'response_type': 'code',
                'redirect_uri': cb,
                'client_id': '11d77446d3054979aaf51054b467ea67',
                'scope': 'characterLocationRead characterNavigationWrite publicData characterContactsRead'
            };

            $window.location.href = host + $httpParamSerializer(params);
        }

        function logout() {
            var promise = $http.post('/user/logout')
            promise.success(function () {
                persistence.set('user', {});
            });
            return promise;
        }

        function getLocation() {
            var promise = $http.get('/user/location');
            promise.success(function (data) {
                persistence.set('user', data);
            });

            return promise;
        }

        return {
            getUser: getUser,
            getLocation: getLocation,
            login: login,
            logout: logout
        };
    }
})();