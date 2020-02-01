
var express         = require("express"),
    router          = express.Router({ mergeParams: true }),
    passport        = require("passport"),
    User            = require("../models/user"),
    sendJSON        = require("../utilities/send-json"),
    authMiddlware   = require("../middleware/auth"),
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

    var newUser = {
        username: body.username,
        email: body.email
    };

    User.findOne({ username: newUser.username }, function(err, user) {
        if(err) {
            return sendJSON(res, "error", { message: "Username Check Failed", error: err }, 500);
        }
        if(user) {
            return sendJSON(res, "error", { message: "Username Taken" }, 400);
        }
        
        console.log(newUser);

        User.register(newUser, body.password, function (err, createdUser) {
            if (err) {
                console.log(createdUser);
                console.log(err);
                return sendJSON(res, "error", { message: "Error creating user", error: err }, 500);
            }
            passport.authenticate("local")(req, res, function () {
                var token = createdUser.generateToken();
                sendJSON(res, "success", { message: "Successfully Registered!", token: token, user: createdUser }, 201);
            });

        })

    })

});

router.post("/login", function(req, res) {
    // TODO
    sendJSON(res, "error", { message: "Not Yet Implemented" }, 301);
});

router.get("/profile", authMiddlware.loggedIn, function(req, res) {
    sendJSON(res, "user", req.user);
});

router.get("/profile/:id", function(req, res) {
    // TODO
    sendJSON(res, "error", { message: "Not Yet Implemented" }, 301);
});

module.exports = router;