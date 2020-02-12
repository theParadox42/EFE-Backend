// Dependencies
var express         = require("express"),
    router          = express.Router({ mergeParams: true }),
    passport        = require("passport"),
    User            = require("../models/user"),
    manageUsers     = require("../utilities/manage-users"),
    sendJSON        = require("../utilities/send-json"),
    authMiddleware  = require("../middleware/auth"),
    emailValidator  = require("email-validator");

// Create an account
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
        
        User.register(newUser, body.password, function (err, createdUser) {
            if (err) {
                return sendJSON(res, "error", { message: "Error creating user", error: err }, 500);
            }
            passport.authenticate("local")(req, res, function () {
                var token = createdUser.generateToken();
                sendJSON(res, "success", { message: "Successfully Registered!", token: token, user: createdUser.getNiceVersion() }, 201);
            });
        });

    });

});

// Used to access tokens
router.post("/login", function(req, res, next) {

    // Check if user is already logged in
    authMiddleware.getUser(req, res, function(_, user) {

        var user = req.user
        if (user) {
            return sendJSON(res, "success", { 
                message: "User already validated", 
                token: req.user.newAuthToken(), 
                user: user.getNiceVersion()
            });
        }
        
        // Local Auth
        var localAuthenticator = passport.authenticate('local', function (err, foundUser) {
            if (err) {
                return sendJSON(res, "error", { message: "Error Authenticating", error: err, user: foundUser.getNiceVersion() }, 400);
            }
            if (!foundUser) {
                return sendJSON(res, "error", { message: "Invalid Credentials", error: "No user authenticated" }, 400);
            }
            var token = foundUser.generateToken();
            return sendJSON(res, "success", { message: "Successfully logged in.", token: token, user: foundUser.getNiceVersion() });
        });
        localAuthenticator(req, res, next);
    });

});

// Delete a user 
router.delete("/profile", authMiddleware.isntAdmin, function(req, res) {
    manageUsers.deleteUser(req, res, User.findByIdAndDelete(req.user._id));
    req.logout();
});

router.delete("/profile/:username", authMiddleware.isAdmin(1), function(req, res) {
    if (req.user.adminPowers >= 2) {
        sendJSON(res, "error", { message: "I ALREADY SAID ADMINS CAN'T DELETE THEIR OWN ACCOUNTS. CONTACT ME IF YOU NEED TO. paradox42.programming@gmail.com IS A GOOD PLACE TO START" }, 1000);
    } else {
        manageUsers.deleteUser(req, res, User.findOneAndDelete({ username: req.params.username }));
    }
});

// Get user data
router.get("/profile", authMiddleware.loggedIn, function (req, res) {
    manageUsers.sendProfile(req, res, User.findById(req.user._id));
});

router.get("/profile/:username", function(req, res) {
    manageUsers.sendProfile(req, res, User.findOne({ username: req.params.username }));
});

module.exports = router;