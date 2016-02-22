"use strict";
var https = require('https');
var parseString = require('xml2js').parseString;
var jumps = [];
module.exports.getData = function getData() {
    https.get('https://api.eveonline.com/map/Jumps.xml.aspx', handleResponse);
};

function handleResponse(res) {
    //TODO error handling
    var doc = '';
    res.on('data', function buildDoc(d) {
        doc += d.toString();
    })
    res.on('end', function createObj() {
        parseString(doc, function (err, obj) {
            if (!err) addJumps(obj.eveapi.result[0].rowset[0].row);
        });
    })
}

function addJumps(systems) {
    var i, system, l = systems.length;
    for (i = 0; i < l; i++) {
        system = systems[i].$;
        jumps.push({ system: system.solarSystemID, jumps: system.shipJumps });
    }
}