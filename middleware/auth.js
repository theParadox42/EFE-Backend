
// Some AUTH middleware

var sendJSON    = require("../utilities/send-json"),
    passport    = require("passport"),
    User        = require("../models/user");


function getUser(req, res, callback) {
    
    // Check if user already exists
    if(req.isAuthenticated()) return callback();
    
    try {

        var token = req.header('Authorization').replace('Bearer', '').trim();
        var decoded = jwt.verify(token, process.env.SECRET);
        
        User.findOne({ _id: decoded.id }, function(err, foundUser) {
            
            if(err) {
                return sendJSON(res, "error", { message: "Error finding associated user", error: err }, 500);
            }
            if (!foundUser) {
                return sendJSON(res, "error", { message: "No User found, check auth", error: "Empty User", user: foundUser}, 400);
            }
            req.token = token;
            req.user = foundUser;
            callback(foundUser);
        });

    } catch (err) {
        sendJSON(res, "error", { message: "Bad Authorization", error: err }, 400);
    }

}

var middleware = {
    loggedIn: function(req, res, next) {
        getUser(req, res, function(user) {
            next();
        });
    },
    test: function(req, res, next) {
        next();
    }
}

module.exports = middleware;
