(function () {

    angular
        .module('universe')
        .factory('universeFactory', ['$http', universeFactory]);

    function universeFactory($http) {
        var kspace = {};
        var subspace = {};
        var xMin, xMax, yMin, yMax, zMin, zMax;
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
            if(!filters);
                angular.copy(kspace, subspace);
            //Adjust map limits
            setMapLimits();
        }
        function setMapLimits() {
            xMin = 0, xMax = 0;
            yMin = 0, yMax = 0;
            zMin = 0, zMax = 0;
            var keys = Object.keys(kspace);
            var i, l = keys.length;
            for (i = 0; i < l; i++) {
                var system = kspace[keys[i]];
                updateLimits(system.x, system.y, system.z);
            }
        }
        function updateLimits(x, y, z) {
            if (x > xMax)
                xMax = x;
            else if (x < xMin)
                xMin = x;
            if (y > yMax)
                yMax = y;
            else if (y < yMin)
                yMin = y;
            if (z > zMax)
                zMax = z;
            else if (z < zMin)
                zMin = z;
        }
        return {
            "get": getKspace,
            "systems": subspace,
            "limits": {
                xMin: xMin, xMax: xMax,
                yMin: yMin, yMax: yMax,
                zMin: zMin, zMax: zMax
            },
            "filter": filter
        };
    }

})();