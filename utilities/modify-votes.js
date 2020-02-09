
var Level   = require("../models/level"),
    sendJSON= require("../utilities/send-json");

function setLevelVotes(req, res, voteKey) {
    // Start by removing any votes from the user
    var removeUserVotes = {
        $pull: {
            likes: req.user._id.toString(),
            dislikes: req.user._id.toString()
        }
    }
    Level.findByIdAndUpdate(req.params.levelid, removeUserVotes, { new: true }, function (err, updatedLevel) {

        console.log(req.user._id);
        console.log(updatedLevel);
        console.log(updatedLevel.meta.likes[0].equals(req.user._id));

        if (err) {
            sendJSON(res, "error", { message: "Error Removing Existing Votes", error: err }, 400);
        } else if (!updatedLevel) {
            sendJSON(res, "error", { message: "No Level Found To Edit", error: "Level not found" }, 400);
        } else {
            
            // Now remove votes from own array
            var userMeta = req.user.meta;
            function filterVotes(levelId) {
                return levelId != updatedLevel._id;
            }
            req.user.meta.myLikes = userMeta.myLikes.filter(filterVotes);
            req.user.meta.myDislikes = userMeta.myDislikes.filter(filterVotes);

            // Now add votes back in
            switch (voteKey) {
                case "neutral":
                    req.user.save();
                    return sendJSON(res, "success", { message: "Successfully removed votes from level!" });
                break;
                case "like":
                    updatedLevel.meta.likes.push(req.user._id.toString());
                    req.user.meta.myLikes.push(updatedLevel._id);
                break;
                case "dislike":
                    updatedLevel.meta.dislikes.push(req.user._id.toString());
                    req.user.meta.myLikes.push(req.user._id);
                break;
                default:
                    return sendJSON(res, "error", { message: "Nonvalid Voting Type", error: "Not a match" }, 500);
            }
            req.user.save();
            updatedLevel.save();
            return sendJSON(res, "success", { message: "Successfully updated Level!" });
        }
    });
}


module.exports = setLevelVotes;



// Old Code Just in case

/*
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
*/