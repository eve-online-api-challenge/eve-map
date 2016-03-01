"use strict";
var h = require('./db.helper');
var auth = require('../lib/auth');

//If sending user document, you _MUST_ redact this
var redact = { sec: 0 };

module.exports = function UserModel(db) {
    var c = db.collection('users');

    this.validateLogin = function (userId, password, success, error) {
        //In this case we can't redact, delete sec instead
        var find = { '_id': userId };
        c.findOne(find, h.findOne(validatePassword, error));

        function validatePassword(doc) {
            if (auth.compare(password, doc.sec.hash)) {
                delete doc.sec;
                success(doc);
            }
            else {
                error({ authFail: true });
            }
        }
    }

    this.startSession = function (userId, success, error) {
        var sessionId = auth.createRandomHash();

        var find = { '_id': userId };
        var update = { '$push': { 'sec.sessions': sessionId } };
        c.update(find, update, h.update(setSession, error));
        function setSession() {
            success(sessionId);
        }
    };

    this.getSession = function (sessionId, success, error) {
        var find = { 'sec.sessions': sessionId };
        c.findOne(find, redact, h.findOne(success, error));
    };

    this.endSession = function (sessionId, success, error) {
        var find = { 'sec.sessions': sessionId };
        var update = { '$pull': { 'sec.sessions': sessionId } };
        console.log(find);
        console.log(update)
        c.update(find, update, h.update(success, error));
    };

    this.createAccount = function (user, password, success, error) {
        user.sec = { hash: auth.hash(password) };
        c.insert(user, success, error);
    };
}