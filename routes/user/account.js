"use strict";
var express = require('express');
var crest = require('../../lib/crest');

module.exports.router = accountRouter;
module.exports.Ctrl = AccountCtrl;

function accountRouter(ctrl) {
    var router = express.Router();
    router.post('/logout', ctrl.logout);
    router.get('/me', ctrl.getMe);
    router.post('/sso/:code', ctrl.eveLogin)
    return router;
}

function AccountCtrl(models, productionMode) {
    var model = models.user;
    var cookieSettings = { httpOnly: true };
    if (productionMode) cookieSettings.secure = true;

    this.eveLogin = function (req, res, next) {
        if (!req.params.code)
            next({ invalidInput: true });
        crest.verify(req.params.code, verified, next);

        function verified(data) {
            //Create an account if it doesn't already exist
            var user = {
                _id: data.CharacterName,
                eveId: data.CharacterID
            }
            
            //TODO ensure duplicate key error, else real error
            model.createAccount(user, startSession, startSession);
            function startSession() {
                model.startSession(user._id, setCookie, next);
            }

            function setCookie(sessionId) {
                res.cookie('sessionId', sessionId, cookieSettings);
                res.status(200).send();
            }
        }
    };

    this.logout = function (req, res, next) {
        model.endSession(req.cookies.sessionId, clearSessionCookie, next);
        function clearSessionCookie() {
            res.clearCookie('sessionId');
            res.status(200).send();
        }
    };

    this.getMe = function (req, res, next) {
        if (req.user !== undefined)
            res.json(req.user);
        else
            res.json({ noOne: true });
    };
}