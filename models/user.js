
var mongoose    = require("mongoose"),
    moment      = require("moment");

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

userSchema.virtual("sinceCreated").get(function() {
    return moment(this.createdAt).fromNow();
});

module.exports = mongoose.model("User", userSchema);