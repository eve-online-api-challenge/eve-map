(function () {
    'use strict';

    angular
        .module('universe', [])
        .config(['$stateProvider', configureRoutes]);

    function configureRoutes($stateProvider) {
        $stateProvider
            .state('universe', {
                url: '/universe',
                controller: 'UniverseMapCtrl',
                templateUrl: '/templates/universe.map.html',
                anyAuth: true
            });
    }

})();