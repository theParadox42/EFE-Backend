
var mongoose                = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");
    moment                  = require("moment"),
    jwt                     = require("jsonwebtoken"),
    randomStringGenerator   = require("crypto-random-string");

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
        totalLikes: Number,
        totalDislikes: Number,
        flags: Number
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
    var token = jwt.sign({ id: user.id.toString(), key: key }, process.env.SECRET, { expiresIn: "7 days" });
    user.tokens = user.tokens.concat({ token });
    user.save();
    return token;
};

userSchema.methods.getNiceVersion = function () {
    var niceVersion = JSON.parse(JSON.stringify(this));
    niceVersion.sinceCreated = this.sinceCreated;
    delete niceVersion.tokens;
    for (let i = 0; i < this.levels.length; i++) {
        niceVersion.levels[i].sinceCreated = moment(this.levels[i].createdAt).fromNow();
    }
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