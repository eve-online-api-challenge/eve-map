(function () {
    'use strict';

    angular
        .module('user', [])
        .config(['$stateProvider', configureRoutes]);

    function configureRoutes($stateProvider) {
        $stateProvider
            .state('crestcb', {
                url: '/crest/callback?code&state',
                controller: 'CrestCtrl',
                anyAuth: true
            })
    }

})();