
var mongoose = require("mongoose"),

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 1
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    sinceCreated: String,
    levels: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Level"
            },
            title: String,
            type: String,
            sinceCreated: String
        }
    ],
    meta: {
        totalLikes: Number,
        totalDislikes: Number,
        flags: Number
    }
});



module.exports = mongoose.model("User", userSchema);