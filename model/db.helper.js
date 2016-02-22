module.exports.findOne = findOneWrapper;
module.exports.update = updateWrapper;
module.exports.insert = insertWrapper;
module.exports.remove = removeWrapper;

function findOneWrapper(success, error) {
    return function findOneCb(err, doc) {
        if (err)
            error(err);
        else if (!doc)
            error({ noDocument: true });
        else
            success(doc);
    }
}

function updateWrapper(success, error) {
    return function updateCb(err, r) {
        if (err)
            error(err);
        else if (r.result.n === 0)
            error({ noUpdate: true });
        else
            success();
    }
}

function insertWrapper(success, error) {
    return function insertCb(err, r) {
        if (err) {
            if (err.code === 11000)
                error({ duplicate: true });
            else
                error(err);
        }
        else
            success();
    }
}

function removeWrapper(success, error) {
    return function removeCb(err, r) {
        if (err)
            error(err);
        else if (r.result.n === 0)
            error({ noDocument: true });
        else
            success();
    }
}