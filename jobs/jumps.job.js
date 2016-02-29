"use strict";
var https = require('https');
var parseString = require('xml2js').parseString;
var schedule = require('node-schedule');

module.exports = JumpsJob;

function JumpsJob(models) {
    var model = models.jumps;
    var job, self = this;

    this.start = function () {
        https.get('https://api.eveonline.com/map/Jumps.xml.aspx', handleResponse);
    };

    this.stop = function () {
        if (job) job.cancel();
    };

    var handleResponse = function (res) {
        var doc = '';
        res.on('data', function buildDoc(d) {
            doc += d.toString();
        })
        res.on('end', function createObj() {
            parseString(doc, function (err, obj) {
                var nextJobStartTime;
                if (!err) {
                    try {
                        var doc = { jumps: [] };
                        var cachedTill = new Date(obj.eveapi.cachedUntil[0]).valueOf();
                        var serverTime = new Date(obj.eveapi.currentTime[0]).valueOf();
                        var localTIme = new Date().valueOf();
                        addJumps(doc.jumps, obj.eveapi.result[0].rowset[0].row);
                        //Use timestamp as id to prevent duplicates
                        doc._id = cachedTill;
                        model.insert(doc, doNothing, doNothing);
                        //Give it another 15 seconds, just in case they only just started their job
                        nextJobStartTime = new Date(localTIme + cachedTill - serverTime + 15000);

                    }
                    catch (e) {
                        console.log(e)
                        err = e;
                    }
                }

                if (err) {
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
            jumps.push({ system: Number(system.solarSystemID), jumps: Number(system.shipJumps) });
        }
    };

    var doNothing = function () { };
}