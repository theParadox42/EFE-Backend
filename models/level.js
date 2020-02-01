
// A very simple document

var mongoose = require("mongoose");

var levelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 1
    },
    type: String,
    levelData: mongoose.Schema.Types.Mixed,
    creator: String,
    difficulty: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    sinceCreated: String,
    creator: {
        username: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    },
    meta: {
        featured: {
            type: Boolean,
            default: false
        },
        likes: Number,
        dislikes: Number,
        flags: Number
    },
});

module.exports = mongoose.model("Level", levelSchema);