
module.exports = function(res, type, object, status) {
    res.status(status || 400).json({
        type: type,
        object: object
    });
}

