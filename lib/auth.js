"use strict";
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;
var crypto = require('crypto');

module.exports.createRandomHash = function () {
    var currentDate = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    return crypto.createHash('sha1').update(currentDate + random).digest('hex');
};

module.exports.hash = function (password) {
    var salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
};

module.exports.compare = function (password, hash) {
    return bcrypt.compareSync(password, hash);
};