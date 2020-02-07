
// I am NOT proud of this coding right here.


// Dependencies
var mongoose = require("mongoose");
var express = require("express");
var router = express.Router({ mergeParams: true });

// Mongoose
var Schema = mongoose.Schema;
var oldLevelSchema = new Schema({
    title: String,
    type: String,
    map: String,
    level: [String],
    objects: Object,
    creator: String,
    difficulty: Number
})
var OldLevel = mongoose.model("OldLevel", oldLevelSchema);

// Get
router.get("/", function (req, res) {
    res.send("Deprecated Routes")
})
router.get("/levels", function (req, res) {
    OldLevel.find({}, function (err, levels) {
        if (err) {
            console.log("Error Getting Levels: " + err);
            res.send("Error");
        } else {
            res.send(levels);
        }
    })
});

// Post New Level
router.post("/levels/new", function (req, res) {
    var b = req.body;
    var newLevel = {
        title: b.title || "Untitled Level",
        objects: b.objects || {},
        type: b.type || "null",
        map: b.map || "",
        level: b.level || [],
        creator: b.creator || "Anonymous",
        difficulty: Math.min(Math.max(b.difficulty || 1, 1), 10)
    }
    if (b._id) {
        OldLevel.find({ _id: b._id }, function (err, levels) {
            if (err) {
                console.warn("Error finding match")
                console.warn(err);
                return;
            }
            if (!levels.length) {
                OldLevel.create(newLevel, function (err, newLvl) {
                    if (err) {
                        console.warn("Error adding level")
                        console.warn(err);
                    } else {
                        res.send(newLvl);
                    }
                });
            } else {
                OldLevel.updateOne({ _id: b._id }, { $set: newLevel }, function (err, updatedLevel) {
                    if (err) {
                        console.warn("Error Updating Level")
                        console.warn(err);
                    } else {
                        res.send(updatedLevel);
                    }
                });
            }
        })
    } else {
        OldLevel.create(newLevel, function (err, newLvl) {
            if (err) {
                console.warn("Error adding level")
                console.warn(err);
            } else {
                res.send(newLvl);
            }
        });
    }
});

module.exports = router;

