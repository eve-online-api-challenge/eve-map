(function () {

    angular
        .module('crest')
        .controller('CrestCtrl', ['$stateParams', '$http', CrestCtrl]);

    function CrestCtrl($stateParams, $http) {
        $http.post('/user/sso/' + $stateParams.code);
    }

})();