(function () {

    angular
        .module('user')
        .controller('CrestCtrl', ['$stateParams', '$http', '$state', CrestCtrl]);

    function CrestCtrl($stateParams, $http, $state) {
        function redirectToLanding() {
            $state.go('landing');
        }
        $http.post('/user/sso/' + $stateParams.code).then(redirectToLanding);
    }

})();