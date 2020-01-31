
// A very simple document

var mongoose = require("mongoose"),
    levelSchema = require("./schemas/level");

module.exports = mongoose.model("Level", levelSchema);