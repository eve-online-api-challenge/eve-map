var content = require('./lib/content');
var js = require('./src/js.init');
var jade = require('./src/jade.init');
var less = require('./src/less.init')

module.exports.initViews = function initViews(production) {
    cleanPub();
    var locals = {};
    if (production) {
        locals.css = '/css/' + less.saveCss();
        locals.scripts = js.getProductionScript();
        jade.initProduction(locals);
    }
    else {
        locals.scripts = js.getDevSripts();
        locals.css = '/css/site.css';
    }
    return locals;
}

function cleanPub() {
    //Ensure dirs exist
    content.createPath('public/js');
    content.createPath('public/css');
    //Clean them if they do
    content.cleanDir('./public/js');
    content.cleanDir('./public/css');
    content.cleanDir('./public');
}