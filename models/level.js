
var mongoose = require("mongoose");

var levelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 1
    },
    type: String,
    map: String,
    level: [String],
    objects: Object,
    creator: String,
    difficulty: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    sinceCreated: String,
    creator: {
        username: String,
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