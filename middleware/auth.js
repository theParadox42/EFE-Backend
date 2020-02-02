
// Some AUTH middleware

var sendJSON    = require("../utilities/send-json"),
    User        = require("../models/user");


function getUser(req, res, callback) {
    
    // Check if user already exists
    if(req.isAuthenticated() && req.user) return callback(null, req.user);

    try {

        var token = req.header('Authorization').replace('Bearer', '').trim();
        var decoded = jwt.verify(token, process.env.SECRET);
        
        User.findOne({ _id: decoded.id, "tokens.token": token }, function(err, foundUser) {
            
            if(err) {
                return callback(err)
            }
            if (!foundUser) {
                return callback(null, false);
            }
            req.token = token;
            req.user = foundUser;
            return callback(null, foundUser);
        });

    } catch (err) {
        callback(err)
    }

}

var middleware = {
    getUser: getUser,
    loggedIn: function(req, res, next) {
        getUser(req, res, function(err, user) {
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
        // TODO
        next();
    }
}

module.exports = middleware;
