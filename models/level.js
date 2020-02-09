
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
        likes: [ String ],
        dislikes: [ String ]
    },
});


levelSchema.path("sinceCreated").get(function () {
    return moment(this.createdAt).fromNow();
});

// Votes
levelSchema.virtual("meta.likeCount").get(function () {
    return this.meta.likes.length;
}); 
levelSchema.virtual("meta.dislikeCount").get(function () {
    return this.meta.dislikes.length;
});

// Returns a version that better represents the level more readably
levelSchema.methods.getNiceVersion = function() {
    var niceLevel = JSON.parse(JSON.stringify(this));
    niceLevel.sinceCreated = this.sinceCreated;
    // Replaces array with number
    niceLevel.meta.likes = this.meta.likeCount;
    niceLevel.meta.dislikes = this.meta.dislikeCount;
    niceLevel.id = this._id;
    return niceLevel;
}

module.exports = mongoose.model("Level", levelSchema);