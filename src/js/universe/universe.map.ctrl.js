(function () {

    angular
        .module('universe')
        .controller('UniverseMapCtrl', ['$scope', 'universeFactory', UniverseMapCtrl]);

    function UniverseMapCtrl($scope, universe) {
        $scope.filters = [];
        
        universe
            .initialize()
            .then(createMap);

        function createMap() {
            // universe.filter.bySecurityGreaterThan(0.5);
            // universe.filter.bySecurityLessThan(0.5);
            // universe.filter.byJumpsFromSystem('30003271', 30);
            var universeMap = new UniverseMap(universe);
            universeMap.initialize();
            universeMap.render();
        }
    }

})();