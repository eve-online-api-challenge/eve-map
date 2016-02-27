var express = require('express');
var jumps = require('./jumps');

module.exports = universeRoutes;

function universeRoutes(models) {
    var router = express.Router();
    
    var jumpsCtrl = new jumps.Ctrl(models);
    var jumpsRouter = jumps.routes(jumpsCtrl);
    router.use('/jumps', jumpsRouter);
    
    return router;
}
