"use strict";
var path = require('path');
var express = require('express');
var pub = path.join(__dirname, '..', 'public');
var startup = require('../startup');
var universe = require('./universe');

function initialize(app, productionMode, models) {
    var jadeLocals = startup.initViews(productionMode);
    var Config;

    if (productionMode)
        Config = require('./production.config');
    else
        Config = require('./dev.config');

    var config = new Config(jadeLocals);
    config.setAppConfig(app);
    config.sslRedirect(app);
    config.registerMiddleware(app);
    
    //Service routes
    app.use('/universe', universe(models));
    
    app.get('*', config.getIndex);
}

module.exports = initialize;