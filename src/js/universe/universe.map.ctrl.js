(function () {

    angular
        .module('universe')
        .controller('UniverseMapCtrl', ['universeFactory', function (universe) {
            var promise = universe.get();
            promise.success(function () {
                // universe = {
                //     systems: {
                //         '1': { x: 0, y: 0, z: 0 },
                //         '2': { x: 0, y: 2, z: 3 },
                //         '3': { x: 0, y: 3, z: -3 },
                //         '4': { x: 3, y: 4, z: 0 },
                //         '5': { x: 3, y: 5, z: 3 },
                //         '6': { x: 3, y: 6, z: -3 },
                //         '7': { x: -3, y: 7, z: 0 },
                //         '8': { x: -3, y: 8, z: 3 },
                //         '9': { x: -3, y: 9, z: -3 },
                //     },
                //     limits: {
                //         xMin: -3,
                //         xMax: 3,
                //         yMin: -1,
                //         yMax: 9,
                //         zMin: -3,
                //         zMax: 3
                //     }
                // };
                var universeMap = new UniverseMap(universe);
                universeMap.initialize();
                universeMap.render();
            });

        }]);

})();