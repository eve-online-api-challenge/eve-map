module.exports.requireAuth = function (req, res, next) {
    var loggedIn = req.user !== undefined;
    if (loggedIn)
        next();
    else
        res.status(401).send();
}

module.exports.authenticate = function (models) {
    var model = models.user;

    return function authenticate(req, res, next) {
        //Find out if they're logged in
        var sessionId = req.cookies.sessionId;

        if (sessionId === undefined)
            return next();

        model.getSession(sessionId, next, success, error);

        function success(user) {
            req.user = user;
            next();
        }
        function error(user) {
            res.clearCookie('sessionId');
            next();
        }
    };
};