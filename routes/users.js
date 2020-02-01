
var express         = require("express"),
    router          = express.Router({ mergeParams: true }),
    mongoose        = require("mongoose"),
    User            = require("../models/user"),
    sendJSON        = require("../utilities/send-json");


router.post("/register", function(req, res) {
    // TODO
    sendJSON(res, "error", { message "Not Yet Implemented" }, 301);
});

router.post("/login", function(req, res) {
    // TODO
    sendJSON(res, "error", { message "Not Yet Implemented" }, 301);
});

router.get("/user/:id", function(req, res) {
    // TODO
    sendJSON(res, "error", { message "Not Yet Implemented" }, 301);
});

module.exports = router;