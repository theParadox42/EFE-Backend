
// How a level is formatted via mongoose

var mongoose    = require("mongoose"),
    moment      = require("moment");

var levelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 1
    },
    type: {
        type: String,
        required: true,
        enum: ["run", "build", "space", "mars"]
    },
    levelData: mongoose.Schema.Types.Mixed,
    difficulty: Number,
    creator: {
        username: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    },
    createdAt: {
        type: Date,
        default: Date.now
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


levelSchema.virtual("sinceCreated").get(function () {
    return moment(this.createdAt).fromNow();
});


module.exports = mongoose.model("Level", levelSchema);