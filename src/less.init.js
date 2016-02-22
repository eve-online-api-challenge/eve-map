"use strict";
var less = require('less');
var path = require('path');
var fs = require('fs');
var content = require('../lib/content');

var lessPath = path.join(__dirname, 'less');
var siteLess = path.join(lessPath, 'site.less');

module.exports.saveCss = function saveCss() {
    var siteCss = 'site-' + Date.now() + '.css';
    var siteCssPath = path.join(__dirname, '..', 'public', 'css', siteCss);

    module.exports.createCss(function saveCss(errRender, output) {
        content.save(siteCssPath, output.css);
        content.gzipSaveString(siteCssPath, output.css);
    });

    return siteCss;
};

module.exports.createCss = function createCss(callback) {
    var data = fs.readFileSync(siteLess);
    var siteLessString = data.toString();

    less.render(
        siteLessString,
        {
            paths: [lessPath],
            compress: true
        },
        callback);
}