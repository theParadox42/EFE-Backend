
var express         = require("express"),
    router          = express.Router({ mergeParams: true }),
    mongoose        = require("mongoose"),
    Level           = require("../models/level"),
    sendJSON        = require("../utilities/send-json"),
    validateLevel   = require("../utilities/validate-level");

// CREATE Level
function createLevel(res, levelBody) {
    Level.create(levelBody, function (err, createdLevel) {
        if (err) {
            sendJSON(res, "error", { message: "Error creating level", error: err }, 500);
        } else {
            sendJSON(res, "level", createdLevel, 201);
        }
    });
}

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

// POST New/Update Level
router.post("/new", function (req, res) {

    // Basically validate that the request contains level information formatted correctly
    var newLevel = validateLevel(req.body);

    if (!newLevel) return sendJSON(res, "error", { message: "Level formatted incorrectly", error: "Bad level request" }, 400);

    // Check if should update
    if (newLevel._id) {
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
    } else createLevel(res, newLevel);
});


module.exports = router;