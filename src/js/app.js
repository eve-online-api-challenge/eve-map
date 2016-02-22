(function () {
    'use strict';

    angular
        .module('fight.club', ['ui.router'])
        .config(['$stateProvider', '$urlRouterProvider', configureApp]);

    function configureApp($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('index', {
                url: '/',
                noAuth: true,
                templateUrl: '/templates/landing.html'
            });
    }
})();