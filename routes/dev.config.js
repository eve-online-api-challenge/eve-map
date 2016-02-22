"use strict";
var path = require('path');
var express = require('express');
var publicPath = path.join(__dirname, '..', 'public');
var less = require('../src/less.init');

module.exports = DevConfig;

function DevConfig(locals) {
    var self = this;
    if (!(self instanceof DevConfig))
        self = new DevConfig(locals);

    self.setAppConfig = function setAppConfig(app) {
        //rendering views every time, need view engine set
        app.set('view engine', 'jade');
        app.set('views', path.join(__dirname, '../src/jade'));
    }

    self.sslRedirect = function sslRedirect(app) {
        //Do nothing
    };

    self.registerMiddleware = function registerMiddleware(app) {
        //Compile less into css each request 
        app.get('/css/site.css', function middleware(req, res, next) {
            less.createCss(function sendCss(errRender, output) {
                res.format({'text/css': function() {
                    res.send(output.css);
                }});
            });
        })
        //return each js file separately
        locals.scripts.forEach(function (script) {
            app.get(script.relative, function (req, res, next) {
                res.sendFile(script.absolute);
            });
        });
        //link non gz static
        app.use(express.static(publicPath));
    };

    self.getIndex = function getIndex(req, res, next) {
        //Inject locals & render (if new files will need to restart)
        res.render('index', locals);
    }
}