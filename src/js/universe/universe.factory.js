(function () {

    angular
        .module('universe')
        .factory('universeFactory', ['$http', universeFactory]);

    function universeFactory($http) {
        var kspace = {};
        var subspace = {};
        var limits = { xMin: 0, xMax: 0, yMin: 0, yMax: 0, zMin: 0, zMax: 0 }
        function getKspace() {
            // var promise = $http.jsonp('/sde/kspace.json');
            var promise = $http.get('/sde/kspace.json');
            promise.success(function gotKspace(data) {
                angular.copy(data, kspace);
                //Apply no filters as standard
                filter();
            });
            return promise;
        }
        function filter(filters) {
            //TODO think of filter schema
            //Apply filters to get subspace
            if (!filters)
                angular.copy(kspace, subspace);
            //Adjust map limits
            setMapLimits();
        }
        function setMapLimits() {
            limits.xMin = 0, limits.xMax = 0;
            limits.yMin = 0, limits.yMax = 0;
            limits.zMin = 0, limits.zMax = 0;
            var keys = Object.keys(kspace);
            var i, l = keys.length;
            for (i = 0; i < l; i++) {
                var system = kspace[keys[i]];
                updateLimits(system.x, system.y, system.z);
            }
        }
        function updateLimits(x, y, z) {
            if (x > limits.xMax)
                limits.xMax = x;
            else if (x < limits.xMin)
                limits.xMin = x;
            if (y > limits.yMax)
                limits.yMax = y;
            else if (y < limits.yMin)
                limits.yMin = y;
            if (z > limits.zMax)
                limits.zMax = z;
            else if (z < limits.zMin)
                limits.zMin = z;
        }
        return {
            "get": getKspace,
            "systems": subspace,
            "limits": limits,
            "filter": filter
        };
    }

})();