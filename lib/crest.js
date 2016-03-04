"use strict";
var https = require('https');
var querystring = require('querystring');
var secrets;
try {
    secrets = require('../secrets.json');
}
catch (e) {
    secrets = {}//pretend secrets :)
}

var authOpts = {
    hostname: 'login.eveonline.com',
    path: '/oauth/token',
    method: 'POST',
    headers: {
        Authorization: 'Basic ' + (new Buffer(secrets.clientId + ":" + secrets.clientKey).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded',
    }
};

var userOpts = {
    hostname: 'login.eveonline.com',
    path: '/oauth/verify',
    method: 'GET',
    headers: {
    }
};

module.exports.verify = function (code, success, error) {
    var data = querystring.stringify({ grant_type: 'authorization_code', code: code });
    var request = https.request(authOpts, handleReponse);
    request.write(data);
    request.end();
    request.on('error', handleErrorWrapper(error));

    function handleReponse(res) {
        res.on('data', function (data) {
            try {
                var auth = JSON.parse(data.toString());
                module.exports.getCharName(auth, success, error);
            }
            catch (e) {
                error(e);
            }
        });
    }
};

module.exports.getCharName = function (auth, success, error) {
    userOpts.headers.Authorization = 'Bearer ' + auth.access_token;
    var r = https.request(userOpts, handleReponse);
    r.end();
    r.on('error', handleErrorWrapper(error));

    function handleReponse(res) {
        res.on('data', function (data) {
            try {
                var obj = JSON.parse(data.toString());
                obj.access_token = auth.access_token;
                obj.refresh_token = auth.refresh_token;
                obj.expires_in = auth.expires_in;
                success(obj);
            }
            catch (e) {
                error(e);
            }
        });
    }
};

module.exports.refreshToken = function (refreshToken, success, error) {
    var data = querystring.stringify({ grant_type: 'refresh_token', refresh_token: refreshToken });
    var request = https.request(authOpts, handleReponse);
    request.write(data);
    request.end();
    request.on('error', handleErrorWrapper(error));

    function handleReponse(res) {
        res.on('data', function (data) {
            try {
                var auth = JSON.parse(data.toString());
                success(auth.access_token);
            }
            catch (e) {
                error(e);
            }
        });
    }
}

function handleErrorWrapper(errCb) {
    return function handleError(e) {
        console.error(e);
        errCb(e);
    }
}