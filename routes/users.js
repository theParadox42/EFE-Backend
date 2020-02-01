
var express         = require("express"),
    router          = express.Router({ mergeParams: true }),
    mongoose        = require("mongoose"),
    User            = require("../models/user"),
    sendJSON        = require("../utilities/send-json"),
    emailValidator  = require("email-validator");


router.post("/register", function(req, res) {
    
    var body = req.body;

    // Validates the user info
    if (typeof body.username != "string" || 
        typeof body.password != "string" || 
        typeof body.email != "string" ||
        !emailValidator.validate(body.email)) {
        return sendJSON(res, "error", { message: "Register Formatted Incorrectly", error: "Bad Format" }, 400);
    }

    User.find({ username: body.username }, function(err, user) {
        if(err) {
            return sendJSON(res, "error", { message: "Username Check Failed", error: err }, 500);
        }
        if(user) {
            return sendJSON(res, "error", { message: "Username Taken" }, 400);
        }
        
    })

});

router.post("/login", function(req, res) {
    // TODO
    sendJSON(res, "error", { message: "Not Yet Implemented" }, 301);
});

router.get("/user/:id", function(req, res) {
    // TODO
    sendJSON(res, "error", { message: "Not Yet Implemented" }, 301);
});

module.exports = router;