"use strict";
var express = require('express');

module.exports.router = accountRouter;
module.exports.Ctrl = AccountCtrl;

function accountRouter(ctrl) {
    var router = express.Router();
    router.post('/login', ctrl.login);
    router.post('/logout', ctrl.logout);
    return router;
}

function AccountCtrl(models, productionMode) {
    var model = models.user;
    var cookieSettings = { httpOnly: true };
    if (productionMode) cookieSettings.secure = true;

    this.login = function (req, res, next) {
        var _id = req.body._id;
        var password = req.body.password;

        if (!_id || !password) {
            return next({ invalidModel: true });
        }
	
        //Force _id to lowercase
        _id = _id.toLowerCase();
	
        //Input looks good, try to validate
        model.validateLogin(_id, password, startSession, next);

        function startSession(user) {
            //Credentials valid, start session
            model.startSession(user._id, sendReply, next);
        }

        function sendReply(sessionId) {
            //Set a cookie with the new sessionId
            res.cookie('sessionId', sessionId, cookieSettings);
            res.status(200).send();
        }
    };

    this.logout = function (req, res, next) {
        model.endSession(req.cookies.sessionId, endSessionCb, next);
        function endSessionCb() {
            res.clearCookie('sessionId');
            res.status(200).send();
        }
    };
}