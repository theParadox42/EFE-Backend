
var express         = require("express"),
    router          = express.Router({ mergeParams: true }),
    sendJSON        = require("../utilities/send-json");

router.get("/", function(req, res){
    sendJSON(res, "success", { message: "Welcome to the Escape From Earth API! Play it at https://escapefromearth.tk. /v1 is the old, deprecated version, and /v2 is the new version." });
});

router.get("/v2", function(req, res) {
    sendJSON(res, "success", { message: "Welcome to the second groundbreaking version of Escape From Earth Backend"}, 200);
});

router.get("*", function(req, res){
    sendJSON(res, "error", { message: "Path not registered", error: "404 Not Found" }, 404);
});

router.post("*", function(req, res){
    sendJSON(res, "error", { message: "Post route not found", error: "404 Not Found" }, 404);
});

router.put("*", function (req, res) {
    sendJSON(res, "error", { message: "Put route not found", error: "404 Not Found" }, 404);
});

router.delete("*", function (req, res) {
    sendJSON(res, "error", { message: "Delete route not found", error: "404 Not Found" }, 404);
});

module.exports = router;