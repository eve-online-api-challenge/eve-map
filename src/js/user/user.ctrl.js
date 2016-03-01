(function () {
    'use strict';

    angular
        .module('user')
        .controller('UserCtrl', ['$scope', '$state', UserCtrl])
        .controller('LoginCtrl', ['userFactory', '$scope', LoginCtrl])
        .controller('RegistrationCtrl', ['userFactory', '$scope', RegistrationCtrl]);

    function UserCtrl($scope, $state) {
        $scope.redirectToLanding = function () {
            $state.go('landing');
        }
    }

    function LoginCtrl(userFactory, $scope) {
        var userStub = {};
        $scope.userStub = userStub;
        $scope.login = function () {
            userFactory
                .login(userStub)
                .success($scope.redirectToLanding)
                .error(examineError);
        };

        function examineError(error) {
            //probably wrong password, check it
        }
    }

    function RegistrationCtrl(userFactory, $scope, $state) {
        var newUser = {};
        $scope.newUser = newUser;
        $scope.register = function () {
            if (newUser.password !== newUser.confirm) {
                $scope.passwordMissMatch = true;
            }
            else {
                $scope.passwordMissMatch = false;
                //Input valid, try registering
                userFactory
                    .register(newUser)
                    .success($scope.redirectToLanding)
                    .error(registrationFail);
            }
        };

        function registrationFail() {
            //Mock the user
        }
    }

})();