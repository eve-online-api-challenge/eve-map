#!/bin/env nodesta
"use strict";
var express = require('express');
var path = require('path');
var http = require('http');
var routes = require('./routes');

var Server = function () {
    var self = this;

    self.setupVariables = function () {
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
        self.port = process.env.OPENSHIFT_NODEJS_PORT || 8082;
        if (self.ipaddress !== "127.0.0.1") self.productionMode = true;
    };

    self.terminator = function (sig) {
        if (typeof sig === "string") {
            console.log('%s: Received %s - terminating app ...', Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()));
    };

    self.setupTerminationHandlers = function () {
        //  Process on exit and signals.
        process.on('exit', function () { self.terminator(); });

        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function (element, index, array) {
            process.on(element, function () { self.terminator(element); });
        });
    };

    self.initialize = function () {
        self.setupVariables();
        self.setupTerminationHandlers();
        
    };

    self.start = function () {
        var app = express();
        app.set('port', self.port);

        routes(app, self.productionMode);

        http.createServer(app).listen(self.port, self.ipaddress, function () {
            console.log('%s: Node server started on %s:%d ...', Date(Date.now()), self.ipaddress, self.port);
        });
    };
};

var app = new Server();
app.initialize();
app.start();