(function () {

    angular
        .module('universe')
        .controller('UniverseMapCtrl', ['universeFactory', UniverseMapCtrl]);

    function UniverseMapCtrl(universe) {
        universe
            .initialize()
            .then(createMap);

        function createMap() {
            universe.filter.byJumpsFromSystem('30000178', 100);

            var universeMap = new UniverseMap(universe);
            universeMap.initialize();
            universeMap.render();
        }
    }

})();