
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
    sinceCreated: String,
    meta: {
        featured: {
            type: Boolean,
            default: false
        },
        published: {
            type: Boolean,
            default: false
        },
        likes: {
            type: Number,
            default: 0
        },
        dislikes: {
            type: Number,
            default: 0
        },
        flags: {
            type: Number,
            default: 0
        },
    },
});


levelSchema.path("sinceCreated").get(function () {
    return moment(this.createdAt).fromNow();
});

levelSchema.methods.getNiceVersion = function() {
    var niceLevel = JSON.parse(JSON.stringify(this));
    niceLevel.sinceCreated = this.sinceCreated;
    return niceLevel;
}


module.exports = mongoose.model("Level", levelSchema);