
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
            return callback(err)
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
    },
    ownsLevel: function(req, res, next) {
        
        Level.findById(req.params.levelid, function(err, foundLevel) {

        });

        next();
    }
}

module.exports = middleware;
