var MongoClient = require('mongodb').MongoClient;
var JumpsModel = require('./jumps.model');

module.exports = function Model() {
    var _db, self = this;

    this.connect = function connect(connectionString, cb) {
        MongoClient.connect(connectionString, init);
        function init(error, db) {
            if (error) throw error;
            _db = db;
            self.jumps = new JumpsModel(_db);
            cb();
        }
    }

    this.disconnect = function disconnect() {
        _db.close();
    }
}