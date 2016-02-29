"use strict";
var gzipStatic = require('connect-gzip-static');
var compression = require('compression');
var path = require('path');
var publicPath = path.join(__dirname, '..', 'public');
var indexPath = path.join(publicPath, 'index.html');
var sendIndexOpts = { maxAge: 3600000 };

module.exports = ProductionConfig;

function ProductionConfig() {
    var self = this;
    if (!(self instanceof ProductionConfig))
        self = new ProductionConfig();

    self.setAppConfig = function setAppConfig(app) {
        //No extra config needed
    }

    self.sslRedirect = function sslRedirect(app) {
        app.enable('trust proxy');
        app.use(function redirectHttp(req, res, next) {
            //require ssl
            if (!req.secure)
                res.redirect(['https://', req.get('Host'), req.url].join(''));
            else
                next();
        });
    };

    self.registerMiddleware = function registerMiddleware(app) {
        //All resources static
        //Need this line else index will 1 year maxAge on cache
        app.get('/', self.getIndex);
        app.use(gzipStatic(publicPath, { maxAge: 31536000000, public: true }));
        //Compress all the things!
        app.use(compression());
    };

    self.getIndex = function getIndex(req, res, next) {
        res.sendFile(indexPath, sendIndexOpts);
    }
}