(function () {

    angular
        .module('universe')
        .controller('UniverseMapCtrl', ['$scope', 'universeFactory', 'universeHttpProvider', UniverseMapCtrl]);

    function UniverseMapCtrl($scope, universeFactory, universeProvider) {
        $scope.activeFilters = [];
        $scope.filters = universeFactory.filters;
        $scope.names = [];

        universeFactory
            .initialize()
            .then(createMap);

        function createMap() {
            // universe.filter.bySecurityGreaterThan(0.5);
            // universe.filter.bySecurityLessThan(0.5);
            // universe.filter.byJumpsFromSystem('30003271', 30);
            getNames();

            var universeMap = new UniverseMap(universeFactory);
            universeMap.initialize();
            universeMap.render();
        }

        function getNames() {
            var prop;
            var obj = universeProvider.space.k;
            var keys = Object.keys(obj);

            for (var i = 0, l = keys.length; i < l; i++) {
                prop = obj[keys[i]];
                $scope.names.push({ name: prop.name, type: 0, id: keys[i] });
            }

            obj = universeProvider.space.regions;
            keys = Object.keys(obj);

            for (var i = 0, l = keys.length; i < l; i++) {
                prop = obj[keys[i]];
                $scope.names.push({ name: prop, type: 1, id: keys[i] });
            }
        }
    }

})();