"use strict";
var path = require('path');
var express = require('express');
var pub = path.join(__dirname, '..', 'public');
var startup = require('../startup');

function initialize(app, productionMode) {
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
    app.get('*', config.getIndex);
}

module.exports = initialize;