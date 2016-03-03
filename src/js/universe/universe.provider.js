(function () {
    angular
        .module('universe')
        .factory('universeHttpProvider', ['$http', universeHttpProvider]);

    function universeHttpProvider($http) {
        var systems = {};
        var jumps = {};

        function getKspace() {
            return $http.get('/sde/kspace.json')
                .success(function gotKspace(data) {
                    angular.copy(data, systems);
                });
        }

        function getJumps() {
            var promise = $http.get('/universe/jumps/latest');
            promise.success(function gotKspace(data) {
                angular.copy(data.jumps, jumps);
            });
            return promise;
        }

        return {
            systems: systems,
            jumps: jumps,
            getKspace: getKspace,
            getJumps: getJumps
        };
    }
})();