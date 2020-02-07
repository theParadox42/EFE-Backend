
var express         = require("express"),
    router          = express.Router({ mergeParams: true }),
    sendJSON        = require("../utilities/send-json");

router.get("/", function(req, res){
    sendJSON(res, "message", { message: "Welcome to the Escape From Earth API! Play it at https://escapefromearth.tk. As of Febuary 1st, the version you are viewing is far ahead of the version you play with. Once I finish I will merge them together and update it all!" });
});

router.get("*", function(req, res){
    sendJSON(res, "error", { message: "Path not registered", error: "404 Not Found" }, 404);
});

router.post("*", function(req, res){
    sendJSON(res, "error", { message: "Post route not found", error: "404 Not Found" }, 404);
});

module.exports = router;