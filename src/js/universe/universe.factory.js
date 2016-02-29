(function () {

    angular
        .module('universe')
        .factory('universeFactory', ['universeHttpProvider', universeFactory]);

    function universeFactory(provider) {
        //Initialization, start with all systems
        var systems = {};
        var limits = { xMin: 0, xMax: 0, yMin: 0, yMax: 0, zMin: 0, zMax: 0 };

        function initialize() {
            return provider.getKspace().then(function () {
                angular.copy(provider.systems, systems);
                updateSubsetLimits();
            });
        }

        function updateSubsetLimits() {
            limits.xMin = Number.MAX_VALUE, limits.xMax = -Number.MAX_VALUE;
            limits.yMin = Number.MAX_VALUE, limits.yMax = -Number.MAX_VALUE;
            limits.zMin = Number.MAX_VALUE, limits.zMax = -Number.MAX_VALUE;

            var keys = Object.keys(systems);

            for (var i = 0, l = keys.length; i < l; i++) {
                var system = systems[keys[i]];
                if (system.x > limits.xMax)
                    limits.xMax = system.x;
                if (system.x < limits.xMin)
                    limits.xMin = system.x;
                if (system.y > limits.yMax)
                    limits.yMax = system.y;
                if (system.y < limits.yMin)
                    limits.yMin = system.y;
                if (system.z > limits.zMax)
                    limits.zMax = system.z;
                if (system.z < limits.zMin)
                    limits.zMin = system.z;
            }
        }

        var filter = {
            byJumpsFromSystem: filterByJumpsFromSystem,
            byRegion: filterByRegion,
            bySecurityGreaterThan: filterSecurityGreaterThan,
            bySecurityLessThan: filterSecurityLessThan
        }

        function filterByJumpsFromSystem(startId, n) {
            //Experiment to optimize tree depth testing
            var layers = [[startId]];
            goDeeper();

            var subset = flatten(layers);
            angular.copy(subset, systems);
            updateSubsetLimits();

            function goDeeper() {
                //Add new layer for the next set of systems
                layers.push([]);
                var previousLayer = layers[layers.length - 2];
                var currentLayer = layers[layers.length - 1];

                previousLayer.forEach(function (systemId) {
                    var system = systems[systemId];
                    system.connections.forEach(function (connectionId) {
                        if (testNotExist(connectionId))
                            currentLayer.push(connectionId);
                    });
                });
                if (layers.length < n)
                    goDeeper();

            }
            function testNotExist(systemId) {
                var l = layers.length;

                //Reverse order testing should be more efficient generally
                while (l--) {
                    var k = layers[l].length;
                    while (k--) {
                        if (systemId === layers[l][k])
                            return false;
                    }
                }
                
                //The system is new
                return true;
            }
            function flatten(layers) {
                var subset = {};
                layers.forEach(function (layer) {
                    layer.forEach(function (systemId) {
                        subset[systemId] = systems[systemId];
                    });
                });
                return subset;
            }
        }

        function filterByRegion(region) {

        }

        function filterSecurityGreaterThan(sec) {

        }

        function filterSecurityLessThan(sec) {

        }

        return {
            systems: systems,
            limits: limits,
            initialize: initialize,
            filter: filter
        }
    }

    //want something injectable
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