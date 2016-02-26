"use strict";
var https = require('https');
var parseString = require('xml2js').parseString;
var schedule = require('node-schedule');

function SystemJumpsJob(model) {
    var job, self = this;

    this.start = function () {
        https.get('https://api.eveonline.com/map/Jumps.xml.aspx', handleResponse);
    };

    this.stop = function () {
        job.cancel();
    };

    var handleResponse = function (res) {
        var doc = '';
        res.on('data', function buildDoc(d) {
            doc += d.toString();
        })
        res.on('end', function createObj() {
            parseString(doc, function (err, obj) {
                var nextJobStartTime, jumps;
                if (!err) {
                    addJumps(jumps, obj.eveapi.result[0].rowset[0].row);
                    model.insert(jumps, doNothing, doNothing);
                    nextJobStartTime = new Date(obj.somepropertyidontknowbecauseeveisoffline);
                }
                else {
                    //Try again in half an hour
                    nextJobStartTime = new Date(Date.now() + 1800000);
                }
                //Either way, register the next job
                job = schedule.scheduleJob(nextJobStartTime, self.start);
            });
        })
    };

    var addJumps = function (jumps, systems) {
        var i, system, l = systems.length;
        for (i = 0; i < l; i++) {
            system = systems[i].$;
            jumps.push({ system: system.solarSystemID, jumps: system.shipJumps });
        }
    };

    var doNothing = function () { };
}