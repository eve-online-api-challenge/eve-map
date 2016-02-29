(function () {
    'use strict';

    angular
        .module('user', [])
        .config(['$stateProvider', configureRoutes]);

    function configureRoutes($stateProvider) {
        $stateProvider
            .state('user', {
                url: '/user',
                controller: 'UserCtrl',
                template: '<div ui-view></div>',
                abstract: true,
            })
            .state('user.login', {
                url: '/login',
                controller: 'LoginCtrl',
                templateUrl: '/templates/account.login.html',
                requireAuth: false
            })
            .state('user.register', {
                url: '/register',
                controller: 'RegistrationCtrl',
                templateUrl: '/templates/account.register.html',
                requireAuth: false
            });
    }

})();