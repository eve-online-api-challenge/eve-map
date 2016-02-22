"use strict";
var fs = require('fs');
var zlib = require('zlib');
var path = require('path');

module.exports.createPath = function createPath(dirPath) {
    var dirs = dirPath.split('/');
    var fullpath = '';
    dirs.forEach(function (dir) {
        fullpath += dir + path.sep;
        try {
            fs.mkdirSync(fullpath);
        }
        catch (error) {
            if (error.code != 'EEXIST')
                throw error;
        }
    });
}

module.exports.gzipSaveString = function gzipSaveString(filePath, data) {
    var Readable = require('stream').Readable;
    var gzip = zlib.createGzip();

    zlib.deflate(data, function (err, res) {
        var s = new Readable;
        s.push(data);
        s.push(null);
        s._read = function noop() { };

        var out = fs.createWriteStream(filePath + '.gz');
        s.pipe(gzip).pipe(out);
    });
};

module.exports.save = function save(filePath, data) {
    fs.writeFileSync(filePath, data);
};

module.exports.cleanDir = function cleanDir(dirPath) {
    var filePath;
    fs.readdirSync(dirPath).forEach(function (fileName) {
        filePath = path.join(dirPath, fileName)
        if (!fs.statSync(filePath).isDirectory()) fs.unlinkSync(filePath);
    });
}