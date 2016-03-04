(function () {
    'use strict';

    angular
        .module('fight.club', ['ui.router', 'persistence', 'universe', 'user'])
        .config(['$stateProvider', '$urlRouterProvider', configureApp])
        .run(['persistenceFactory', 'userFactory', '$rootScope', '$state', configureAuth]);

    function configureApp($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('landing', {
                url: '/',
                controller: 'UniverseMapCtrl',
                templateUrl: '/templates/landing.html',
                anyAuth: true
            });
    }

    function configureAuth(persistence, userFactory, $rootScope, $state) {
        $rootScope.user = persistence.user;
        $rootScope.logout = userFactory.logout;
        $rootScope.login = userFactory.login;
        $rootScope.getLocation = userFactory.getLocation;

        $rootScope.$on('$stateChangeStart', interceptNerds);
        function interceptNerds(event, toState, toParams) {
            if (!persistence.user._id || persistence.user.noOne)
                userFactory.getUser().then(redirectNerds);
            else
                redirectNerds();

            function redirectNerds() {
                //Any auth is allowed
                if (toState.anyAuth) { }
                
                //Only those not logged in allowed
                else if (toState.disallowAuthed && persistence.user.noOne) { }
						
                //Redirect if logged in. E.g. registration
                else if (toState.disallowAuthed && persistence.user._id) {
                    event.preventDefault();
                    $state.go('landing');
                }
                
                //Everything else requires auth
                else if (!persistence.user._id) {
                    event.preventDefault();
                    $state.go('user.login');
                }
            }
        }
    }

})();