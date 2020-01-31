
var mongoose = require("mongoose"),
    userSchema = require("./schemas/user");

module.exports = mongoose.model("User", userSchema);