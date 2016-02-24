"use strict";
var fs = require('fs');
var path = require('path');
var CSVStream = require('csv-streamer');
var content = require('../lib/content');
var jumpCsv = new CSVStream({ headers: true });
var ssCsv = new CSVStream({ headers: true });
var kspace = {};
var wspace = {};

fs.createReadStream('./mapSolarSystems.csv').pipe(ssCsv);

ssCsv
    .on('data', addSystem)
    .on('end', function () {
        fs.createReadStream('./mapSolarSystemJumps.csv').pipe(jumpCsv);
    });

jumpCsv
    .on('data', function (entry) {
        addConnection(entry.FROMSOLARSYSTEMID, entry.TOSOLARSYSTEMID);
    })
    .on('end', function () {
        sortSpaceTypes();
        writeFiles();
    });

function addSystem(o) {
    kspace[o.SOLARSYSTEMID] = {
        name: o.SOLARSYSTEMNAME,
        region: o.REGIONID,
        constellation: o.CONSTELLATIONID,
        x: o.X,
        y: o.Y,
        z: o.Z,
        sec: o.SECURITY,
    };
}

function addConnection(from, to) {
    if (kspace[from].connections === undefined)
        kspace[from].connections = [to];
    else if (kspace[from].connections.indexOf(to) === -1)
        kspace[from].connections.push(to);
}

function sortSpaceTypes() {
    var keys = Object.keys(kspace);
    var i, l = keys.length;
    for (i = 0; i < l; i++) {
        if (kspace[keys[i]].connections === undefined) {
            wspace[keys[i]] = kspace[keys[i]];
            delete kspace[keys[i]];
        }
    }
}

function writeFiles() {
    var file = path.join(__dirname, '..', 'public', 'sde', 'kspace.json');
    var stringy = JSON.stringify(kspace);
    content.save(file, stringy);
    content.gzipSaveString(file, stringy);

    file = path.join(__dirname, '..', 'public', 'sde', 'wspace.json');
    stringy = JSON.stringify(wspace);
    content.save(file, stringy);
    content.gzipSaveString(file, stringy);
}