(function () {
    angular
        .module('universe')
        .factory('universeHttpProvider', ['$http', universeHttpProvider]);

    function universeHttpProvider($http) {
        var space = {};
        var jumps = {};
        
        function getSpace() {
            return $http.get('/sde/space.json')
                .success(function gotKspace(data) {
                    angular.copy(data, space);
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
            space: space,
            jumps: jumps,
            getSpace: getSpace,
            getJumps: getJumps,
        };
    }
})();