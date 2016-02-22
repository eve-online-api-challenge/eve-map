"use strict";
var ugly = require('uglify-js');
var path = require('path');
var content = require('../lib/content');
var relativePaths = require('./js.files.json');

var pub = path.join(__dirname, '..', 'public', 'js');
var scriptsDir = path.join(__dirname, 'js');

module.exports.getDevSripts = function getDevScripts() {
    var scripts = [];
    relativePaths.forEach(function (relativePath) {
        scripts.push({ relative: '/js/' + relativePath, absolute: path.join(scriptsDir, relativePath) });
    });
    return scripts;
};

module.exports.getProductionScript = function getProductionScript() {
    var scripts = [];
    var absFiles = [];
    var outputFile = path.join('site-' + Date.now() + '-.js');
    var outputFileAbs = path.join(pub, outputFile);
    
    //Get absolute path to files
    relativePaths.forEach(function (relativePath) {
        absFiles.push(path.join(scriptsDir, relativePath));
    });

    //Create bundle
    var bundle = ugly.minify(absFiles);
    var code = bundle.code.toString();

    //Save plain & gzip
    content.save(outputFileAbs, code);
    content.gzipSaveString(outputFileAbs, code);
    
    scripts.push({ relative: '/js/' + outputFile, absolute: outputFileAbs });
    return scripts;
};