var express = require('express');
var account = require('./account');

module.exports = function userRoutes(models, productionMode) {
    var router = express.Router();
    var accountCtrl = new account.Ctrl(models, productionMode);
    var accountRouter = account.router(accountCtrl);
    router.use('/user', accountRouter);
    return router;
};