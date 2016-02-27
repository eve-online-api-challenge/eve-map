var JumpsJob = require('./jumps.job');

module.exports = function JobWrangler(models) {
    var jobs = {
        jumps: new JumpsJob(models)
    };

    this.startAll = function () {
        var keys = Object.keys(jobs);
        var i, l = keys.length;
        for (i = 0; i < l; i++) {
            jobs[keys[i]].start();
        }
    };

    this.stopAll = function () {
        var keys = Object.keys(jobs);
        var i, l = keys.length;
        for (i = 0; i < l; i++) {
            jobs[keys[i]].stop();
        }
    };
};