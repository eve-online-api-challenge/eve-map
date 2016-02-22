var h = require('./db.helper');
module.exports = function JumpsModel(db) {
    var c = db.collection('jumps');

    this.insert = function insert(jumps, success, error) {
        c.insert(jumps, h.insert(success, error));
    };

    this.findMostRecent = function findMostRecent(success, error) {
        const find = {};
        const options = { sort: { '$natural': -1 } };
        c.find(find, options, h.findOne(success, error));
    };
}