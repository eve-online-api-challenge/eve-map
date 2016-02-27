#!/bin/env nodesta
"use strict";
var express = require('express');
var path = require('path');
var http = require('http');
var routes = require('./routes');
var Models = require('./model');
var JobWrangler = require('./jobs');

var Server = function () {
    var self = this;

    self.setupVariables = function () {
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
        self.port = process.env.OPENSHIFT_NODEJS_PORT || 8082;
        if (self.ipaddress !== "127.0.0.1") {
            self.mongoConnectionString = 'mongodb://' +
            process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
            process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
            process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
            process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
            process.env.OPENSHIFT_APP_NAME;
            self.productionMode = true;
        }
        else {
            self.mongoConnectionString = 'mongodb://127.0.0.1:27017/fight';
            console.log('Node server in development mode');
        }
    };

    self.terminator = function (sig) {
        if (typeof sig === "string") {
            self.models.disconnect();
            if(self.jobs) self.jobs.stopAll();
            console.log('%s: Received %s - terminating app', Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()));
    };

    self.setupTerminationHandlers = function () {
        //  Process on exit and signals.
        process.on('exit', function () { self.terminator(); });

        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function (element) {
            process.on(element, function () { self.terminator(element); });
        });
    };

    self.initialize = function () {
        self.setupVariables();
        self.setupTerminationHandlers();
        self.models = new Models();
    };

    self.start = function () {
        self.models.connect(self.mongoConnectionString, modelReadyCb);

        function modelReadyCb() {
            startServer();
            startJobs();
        }
        
        function startJobs() {
            self.jobs = new JobWrangler(self.models);
            self.jobs.startAll();
        }
        
        function startServer() {
            var app = express();
            app.set('port', self.port);
            routes(app, self.productionMode, self.models);
            http.createServer(app).listen(self.port, self.ipaddress, logStart);
        }

        function logStart() {
            console.log('%s: Node server started on %s:%d', Date(Date.now()), self.ipaddress, self.port);
        }
    };
};

var app = new Server();
app.initialize();
app.start();