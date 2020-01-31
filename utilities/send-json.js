
module.exports = function(res, type, object, status) {
    res.status(status || 200).json({
        type: type,
        object: object
    });
}

