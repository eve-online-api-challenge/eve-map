"use strict";
var jade = require("jade");
var path = require('path');
var content = require('../lib/content');

module.exports.initProduction = function initProduction(locals) {
    var jadeIndexPath = path.join(__dirname, 'jade', 'index.jade');
    var publicPath = path.join(__dirname, '..', 'public');
    var indexOutputPath = path.join(publicPath, 'index.html');

    //Create index & save it
    var fn = jade.compileFile(jadeIndexPath);
    var html = fn(locals);
    content.save(indexOutputPath, html);
    content.gzipSaveString(indexOutputPath, html);
}