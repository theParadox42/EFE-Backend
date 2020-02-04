
var express         = require("express"),
    router          = express.Router({ mergeParams: true }),
    // mongoose        = require("mongoose"),
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

    req.body.published = false;

    // Basically validate that the request contains level information formatted correctly
    var newLevel = validateLevel(req.body);
    if (!newLevel) {
        return sendJSON(res, "error", { message: "Level formatted incorrectly", error: "Bad level request" }, 400);
    }

    // Set author attributes
    newLevel.creator = {
        username: req.user.username,
        id: req.user._id
    };
    
    // Create level
    Level.create(newLevel, function(err, createdLevel) {
        if(err) {
            sendJSON(res, "error", { message: "Error creating level", error: err }, 400);
        } else if(!createdLevel) {
            sendJSON(res, "error", { message: "Failed to create level", error: "Level not found" }, 400);
        } else {
            req.user.levels.push(createdLevel._id);
            req.user.save();
            var data = { message: "Successfully created level", level: createdLevel.getNiceVersion() }
            sendJSON(res, "success", data);
        }
    });

});

// UPDATE Level
router.put("/:levelid", authMiddleware.canEdit, function (req, res) {

    // Basically validate that the request contains level information formatted correctly
    var updateLevel = validateLevel(req.body);
    if (!updateLevel) {
        return sendJSON(res, "error", { message: "Level formatted incorrectly", error: "Bad level request" }, 400);
    }

    // Find and update level
    Level.findByIdAndUpdate(b._id, { $set: updateLevel }, function (err, updatedLevel) {
        if (err) {
            sendJSON(res, "error", { message: "Error updating level", error: err }, 400);
        } else if(!updatedLevel) {
            sendJSON(res, "error", { message: "No level found and updated", error: "Level Not Found" }, 400);
        } else {
            sendJSON(res, "success", { message: "Level found and updated", level: updatedLevel });
        }
    });
});


module.exports = router;