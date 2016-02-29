(function () {

    angular
        .module('universe')
        .controller('UniverseMapCtrl', ['universeFactory', UniverseMapCtrl]);

    function UniverseMapCtrl(universe) {
        universe
            .initialize()
            .then(createMap);

        function createMap() {
            universe.filter.byJumpsFromSystem('30003271', 10);

            var universeMap = new UniverseMap(universe);
            universeMap.initialize();
            universeMap.render();
        }
    }

})();