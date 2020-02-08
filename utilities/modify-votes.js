
var Level   = require("../models/level"),
    User    = require("../models/user");

function removeVotes(user, level, votes, callback) {
    if (votes.liked) {

    }
    if (votes.disliked) {

    }
    callback(null, true);
}

function setLevelVotes(req, res, voteKey, support) {
    Level.findById(req.params.id, function (err, foundLevel) {
        if (err) {
            sendJSON(res, "error", { message: "Error finding level to vote", error: err }, 400);
        } else if (!foundLevel) {
            sendJSON(res, "error", { message: "No level found to like", error: "Level not found" }, 400);
        } else {

            var alreadyLiked = foundLevel.likes.some(function (like) {
                return like == req.user._id;
            });
            var alreadyDisliked = foundLevel.dislikes.some(function (dislike) {
                return dislike == req.user._id;
            });

            // If the desired action is already completed
            if (alreadyLiked && voteKey == "like" && support) {
                return sendJSON(res, "success", { message: "You have already liked that level!" });
            } else if (alreadyDisliked && voteKey == "dislike" && support) {
                return sendJSON(res, "success", { message: "You have already disliked it!" });
            } else if (!alreadyLiked && voteKey == "like" && !support) {
                return sendJSON(res, "success", { message: "You haven't liked that level yet!" });
            } else if (!alreadyDisliked && voteKey == "dislike" && !support) {
                return sendJSON(res, "success", { message: "You haven't disliked that level yet!" });
            }

            removeVotes(req.user, foundLevel, { liked: alreadyLiked, disliked: alreadyDisliked }, function (err) {
                if (err) {
                    return sendJSON(res, "error", { message: "Error removing votes" })
                }
                if (!support) {
                    return sendJSON(res, "success", { message: `Removed ${voteKey}` });
                }
                // TODO: Add votes back on
            });

        }
    });
}


module.exports = setLevelVotes;