"use strict";
var express = require('express');

module.exports.router = JumpsRouter;
module.exports.Ctrl = JumpsCtrl;

function JumpsRouter(ctrl) {
    var router = express.Router();
    router.get('/latest', ctrl.latest);
    return router;
}

function JumpsCtrl(models) {
    var model = models.jumps;

    this.latest = function (req, res, next) {
        model.findMostRecent(findSuccess, next);
        function findSuccess(doc) {
            res.json(doc);
        }
    };
}