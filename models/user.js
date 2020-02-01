
var mongoose    = require("mongoose"),
    moment      = require("moment"),
    jwt         = require("jsonwebtoken");

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

userSchema.virtual("sinceCreated").get(function() {
    return moment(this.createdAt).fromNow();
});

UserSchema.methods.newAuthToken = async function () {
    var user = this;
    var token = jwt.sign({ id: user.id.toString() }, process.env.SECRET, { expiresIn: "7 days" });
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
};

module.exports = mongoose.model("User", userSchema);