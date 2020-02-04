
var express         = require("express"),
    router          = express.Router({ mergeParams: true }),
    mongoose        = require("mongoose"),
    User            = require("../models/user"),
    Level           = require("../models/level"),
    sendJSON        = require("../utilities/send-json"),
    authMiddleware  = require("../middleware/auth"),
    validateLevel   = require("../utilities/validate-level");

// GET Levels
router.get("/", function (req, res) {
    Level.find({}, function (err, levels) {
        if (err) {
            sendJSON(res, "error", { message: "An error occurred retrieving levels", error: err }, 500);
        } else {
            sendJSON(res, "levels", levels);
        }
    });
});

// CREATE Level
router.post("/", authMiddleware.loggedIn,function (req, res) {

    // Basically validate that the request contains level information formatted correctly
    var newLevel = validateLevel(req.body);
    if (!newLevel) {
        return sendJSON(res, "error", { message: "Level formatted incorrectly", error: "Bad level request" }, 400);
    }

    // Find level to update by _id
    Level.findById(newLevel._id, function (err, foundLevel) {
        if (err || !foundLevel) {
            // If it doesn't exist, create it
            createLevel(res, newLevel);
        } else {
            // Update level if exists
            Level.updateOne({ _id: b._id }, { $set: newLevel }, function (err, updatedLevel) {
                if (err) {
                    sendJSON(res, "error", { message: "Error updating level", error: err }, 500);
                } else {
                    sendJSON(res, "level", updatedLevel);
                }
            });
        }
    });
});

// UPDATE Level
router.put("/:levelid", authMiddleware.ownsLevel, function (req, res) {

    // Basically validate that the request contains level information formatted correctly
    var updateLevel = validateLevel(req.body);
    if (!updateLevel) {
        return sendJSON(res, "error", { message: "Level formatted incorrectly", error: "Bad level request" }, 400);
    }

    // Find and update level
    Level.findByIdAndUpdate(b._id, { $set: updateLevel }, function (err, updatedLevel) {
        if (err) {
            sendJSON(res, "error", { message: "Error updating level", error: err }, 500);
        } else if(!updatedLevel) {
            sendJSON(res, "error", { message: "No level found and updated", error: "Level Not Found" }, 400);
        } else {
            sendJSON(res, "success", { message: "Level found and updated", level: updatedLevel });
        }
    });
});

router.post("/publish/:levelid", authMiddleware.ownsLevel, function(req, res) {

});


module.exports = router;