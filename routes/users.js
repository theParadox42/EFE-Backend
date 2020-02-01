
var express         = require("express"),
    router          = express.Router({ mergeParams: true }),
    mongoose        = require("mongoose"),
    User            = require("../models/user"),
    sendJSON        = require("../utilities/send-json");


router.post("/register", function(req, res) {
    // TODO
});

router.post("/login", function(req, res) {
    // TODO
});

router.get("/user/:id", function(req, res) {
    // TODO
});

module.exports = router;