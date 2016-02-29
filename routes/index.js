"use strict";
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var startup = require('../startup');
var auth = require('./auth');
var universe = require('./universe');
var user = require('./user');

function initialize(app, productionMode, models) {
    var jadeLocals = startup.initViews(productionMode);
    var Config;

    if (productionMode)
        Config = require('./production.config');
    else
        Config = require('./dev.config');

    var config = new Config(jadeLocals);
    //Common app config
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));
    app.use(bodyParser.json({ limit: '350kb' }));
    config.setAppConfig(app);
    config.sslRedirect(app);
    config.registerMiddleware(app);
    
    //Service routes
    app.use(auth.authenticate(models));
    app.use('/universe', universe(models));
    app.use('/user', user(models, productionMode));
    
    //Catch all
    app.get('*', config.getIndex);
}

module.exports = initialize;