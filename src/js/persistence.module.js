(function () {
    'use strict';

    angular
        .module('persistence', [])
        .factory('persistenceFactory', ['dbFactory', PersistenceFactory])
        .factory('dbFactory', fakeDb)

    function PersistenceFactory(dbFactory) {
        function set(prop, data) {
            dbFactory.set(prop, data);
        }

        return {
            systems: dbFactory.db.systems,
            connectiions: dbFactory.db.connections,
            user: dbFactory.db.user,
            set: set
        }
    }

    function fakeDb() {
        var db = {
            user: {},
            systems: {},
            connections: {}
        };
        function set(prop, data) {
            angular.copy(data, db[prop]);
        }
        return {
            db: db,
            set: set
        };
    }

})();