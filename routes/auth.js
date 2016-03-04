module.exports.requireAuth = function (req, res, next) {
    if (req.user !== undefined)
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

        model.getSession(sessionId, success, error);

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