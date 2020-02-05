
// Some AUTH middleware

var sendJSON    = require("../utilities/send-json"),
    User        = require("../models/user"),
    Level       = require("../models/level"),
    passport    = require("passport");


function authUser(req, res, callback) {
    
    // Check if user already exists
    if(req.isAuthenticated() && req.user) return callback(null, req.user);
    
    // Otherwise check for tokens
    var tokenAuthenticator = passport.authenticate("bearer", function(err, authUser, token) {
        if (err) {
            return callback(err);
        }
        if (!authUser) {
            return callback(null, false);
        }
        if(token) {
            req.token = token;
        }
        req.user = authUser;
        return callback(null, authUser);
    });
    tokenAuthenticator(req, res);
};

var middleware = {
    getUser: authUser,
    loggedIn: function(req, res, next) {
        authUser(req, res, function(err, user) {
            if(err) {
                sendJSON(res, "error", { message: "Bad Auth Request", error: err }, 400);
            } else if(!user) {
                sendJSON(res, "error", { message: "Unauthorized Request", error: "Empty User" }, 400);
            } else {
                next();
            }
        });
    }
};
function ownsLevelOrAdminPowers(req, res, adminPowers, next) {
    middleware.loggedIn(req, res, function () {
        Level.findById(req.params.levelid, function (err, foundLevel) {
            if (err) {
                sendJSON(res, "error", { message: "Error finding level", error: err }, 400);
            } else if (!foundLevel) {
                sendJSON(res, "error", { message: "No level found, it probably doesn't exist" }, 400);
            } else {
                if (req.user._id.equals(foundLevel.creator.id) || req.user.adminPowers >= adminPowers) {
                    next();
                } else {
                    sendJSON(res, "error", { message: "Make sure you own the level first", error: "Insufficient Permissions" }, 400);
                }
            }
        });
    });
}
middleware.canEditLevel = function (req, res, next) {
    ownsLevelOrAdminPowers(req, res, 2, next);
}
middleware.canDeleteLevel = function (req, res, next) {
    ownsLevelOrAdminPowers(req, res, 1, next);
};
middleware.isAdmin = function(req, res, next) {
    if(req.user.adminPowers >= 2) {
        next();
    } else {
        sendJSON(res, "error", { message: "Not an admin!", error: "Insufficient Permissions" }, 400);
    }
}

module.exports = middleware;
