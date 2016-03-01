"use strict";
var express = require('express');
var auth = require('../auth');

module.exports.router = accountRouter;
module.exports.Ctrl = AccountCtrl;

function accountRouter(ctrl) {
    var router = express.Router();
    router.post('/login', ctrl.login);
    router.post('/logout', ctrl.logout);
    router.post('/register', ctrl.register);
    router.get('/me', auth.requireAuth, ctrl.getMe);
    return router;
}

function AccountCtrl(models, productionMode) {
    var model = models.user;
    var cookieSettings = { httpOnly: true };
    if (productionMode) cookieSettings.secure = true;

    this.login = function (req, res, next) {
        var _id = req.body.userName;
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
            model.startSession(user._id, setSessionCookie, next);
        }

        function setSessionCookie(sessionId) {
            res.cookie('sessionId', sessionId, cookieSettings);
            res.status(200).send();
        }
    };

    this.logout = function (req, res, next) {
        model.endSession(req.cookies.sessionId, clearSessionCookie, next);
        function clearSessionCookie() {
            res.clearCookie('sessionId');
            res.status(200).send();
        }
    };

    this.register = function (req, res, next) {
        var user = {};
        user.id = req.body.userName;
        var password = req.body.password;

        if (!user.id || !password)
            return next({ invalidInput: true });

        user._id = user.id.toLowerCase();
        model.createAccount(user, password, addUserSuccess, next);

        function addUserSuccess() {
            model.startSession(user._id, setSessionCookie, next);
        }

        function setSessionCookie(sessionId) {
            res.cookie('sessionId', sessionId, cookieSettings);
            res.status(200).send();
        }
    }

    this.getMe = function (req, res, next) {
        res.json(req.user);
    }
}