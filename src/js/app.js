(function () {
    'use strict';

    angular
        .module('fight.club', ['ui.router', 'universe'])
        .config(['$stateProvider', '$urlRouterProvider', configureApp]);

    function configureApp($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: '/templates/landing.html'
            });
    }

})();