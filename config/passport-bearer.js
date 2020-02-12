
var jwt     = require("jsonwebtoken"),
    User    = require("../models/user");

module.exports = function (token, done) {
    try {
        var decoded = jwt.verify(token, process.env.SECRET);

        User.findOne({ _id: decoded.id, "tokens.token": token }, function (err, foundUser) {

            if (err) {
                return done(err)
            }
            if (!foundUser) {
                return done(null, false);
            }
            return done(null, foundUser, token);
        });
    } catch (err) {
        if(err instanceof jwt.TokenExpiredError) {
            User.findOneAndUpdate({ "tokens.token": token }, { $pull: { tokens: { token: token }}}, function() {
                return done(err);
            });
        } else {
            return done(err);
        }
    }

};