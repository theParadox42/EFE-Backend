
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
    var key = randomStringGenerator({ length: 20, type: "base64" });
    var token = jwt.sign({ id: this.id.toString(), key: key }, process.env.SECRET, { expiresIn: "7 days" });
    this.tokens = this.tokens.concat({ token });
    this.save();
    return token;
};

userSchema.methods.getNiceVersion = function () {
    var niceVersion = this;
    niceVersion.sinceCreated = this.sinceCreated;
    niceVersion.tokens = [];
    return niceVersion;
};

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);