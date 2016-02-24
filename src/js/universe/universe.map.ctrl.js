(function () {

    angular
        .module('universe')
        .controller('UniverseMapCtrl', ['universeFactory', function (universe) {
            var promise = universe.get();
            promise.success(function() {
                console.log(universe)
            });
        }]);

})();