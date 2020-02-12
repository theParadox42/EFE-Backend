
// Dependencies
var mongoose                = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");
    moment                  = require("moment"),
    jwt                     = require("jsonwebtoken"),
    randomStringGenerator   = require("crypto-random-string"),
    makeNiceArray           = require("../utilities/make-array-nice");

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 1,
        unique: true
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "Level"
        }
    ],
    roles: [
        {
            type: String,
            enum: ["flexer", "honorary", "moderator", "administrator"],
        }
    ],
    meta: {
        myLikes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Level"
            }
        ],
        myDislikes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Level"
            }
        ]
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

userSchema.path("sinceCreated").get(function() {
    return moment(this.createdAt).fromNow();
});

userSchema.methods.generateToken = function () {
    // Really just a random string that has no purpose but to make tokens more asthetically pleasing
    var user = this;
    var key = randomStringGenerator({ length: 20, type: "base64" });
    var token = jwt.sign({ id: user.id.toString(), key: key }, process.env.SECRET, { expiresIn: "14 days" });
    user.tokens = user.tokens.concat({ token });
    user.save();
    return token;
};

function getTotalVotes(user, key) {
    var totalVotes = 0;
    var returnVotes = false;
    user.levels.forEach(function (level) {
        if (typeof level.title == "text" && typeof level.meta.likes.length == "number") {
            totalVotes += level.meta.likes.length;
            returnVotes = true;
        }
    });
    if (returnVotes) {
        return totalVotes;
    } else {
        return null;
    }
}

userSchema.methods.getNiceVersion = function () {
    var niceVersion = JSON.parse(JSON.stringify(this));
    niceVersion.sinceCreated = this.sinceCreated;
    niceVersion.id = this._id;
    delete niceVersion.tokens;
    delete niceVersion.meta.myLikes;
    delete niceVersion.meta.myDislikes;
    niceVersion.levels = makeNiceArray(this.levels);
    // Manage like counts
    var totalLikes = getTotalVotes(this, "likes");
    var totalDislikes = getTotalVotes(this, "dislikes");
    if(totalLikes) niceVersion.meta.totalLikes = totalLikes;
    if(totalDislikes) niceVersion.meta.totalDislikes = totalDislikes;
    return niceVersion;
};

userSchema.virtual.adminPowers = function() {
    var maxLevel = 0;
    this.roles.forEach(role => {
        switch(role) {
            case "moderator":
                maxLevel = Math.max(maxLevel, 1);
            break;
            case "administrator":
                maxLevel = Math.max(maxLevel, 2);
            break;
        }
    });
};

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);