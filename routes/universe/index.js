var express = require('express');
var jumps = require('./jumps');

module.exports = function universeRoutes(models) {
    var router = express.Router();
    var jumpsCtrl = new jumps.Ctrl(models);
    var jumpsRouter = jumps.router(jumpsCtrl);
    router.use('/jumps', jumpsRouter);
    return router;
};