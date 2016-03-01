"use strict";
var express = require('express');
var auth = require('../auth');
var https = require('https');

module.exports.router = accountRouter;
module.exports.Ctrl = AccountCtrl;

function accountRouter(ctrl) {
    var router = express.Router();
    router.post('/login', ctrl.login);
    router.post('/logout', ctrl.logout);
    router.post('/register', ctrl.register);
    router.get('/me', ctrl.getMe);
    router.post('/sso/:code', ctrl.fuckyousso)
    return router;
}

function AccountCtrl(models, productionMode) {
    var model = models.user;
    var cookieSettings = { httpOnly: true };
    if (productionMode) cookieSettings.secure = true;

    this.fuckyousso = function (req, res, next) {
        if (!req.params.code)
            next({ invalidInput: true });

        var options = {
            hostname: 'login.eveonline.com',
            path: '/oauth/token?grant_type=authorization_code&code=' + req.params.code,
            method: 'POST',
            headers: {
                Authorization: 'Basic ' + (new Buffer("11d77446d3054979aaf51054b467ea67:ZHIgybKxgeYQFSYumPuhR0FZhk6IsV3e48ScPg8K").toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };


        https.request(options, function foo(res) {
            res.on('data', function (data) {
                console.log('yeah, just mostly fuck you');
            });
        });
    }

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
        if (req.user !== undefined)
            res.json(req.user);
        else
            res.json({ noOne: true });
    }
}