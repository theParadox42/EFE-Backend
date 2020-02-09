
var Level   = require("../models/level"),
    sendJSON= require("../utilities/send-json");

function setLevelVotes(req, res, voteKey) {
    Level.findById(req.params.levelid, function (err, foundLevel) {

        console.log(updatedLevel.meta.likes[0].equals(req.user._id)); // true

        if (err) {
            sendJSON(res, "error", { message: "Error Removing Existing Votes", error: err }, 400);
        } else if (!foundLevel) {
            sendJSON(res, "error", { message: "Level not found, check if it exists!", error: "Level not found" }, 400);
        } else {
        
            // Remove votes from foundLevel
            var levelMeta = foundLevel.meta;
            function LevelVotes(userId) {
                return !userId.equals(req.user._id);
            };
            
            // Now remove votes from own array
            var userMeta = req.user.meta;
            function filterMyVotes(levelId) {
                return !levelId.equals(updatedLevel._id);
            }
            req.user.meta.myLikes = userMeta.myLikes.filter(filterMyVotes);
            req.user.meta.myDislikes = userMeta.myDislikes.filter(filterMyVotes);

            var returnMessage = "Successfully Voted Level!";
            // Now add votes back in
            switch (voteKey) {
                case "neutral":
                    returnMessage = "Succesfully Removed Rating!";
                break;
                case "like":
                    foundLevel.meta.likes.push(req.user._id.toString());
                    req.user.meta.myLikes.push(foundLevel._id);
                break;
                case "dislike":
                    foundLevel.meta.dislikes.push(req.user._id.toString());
                    req.user.meta.myDislikes.push(foundLevel._id);
                break;
                default:
                    return sendJSON(res, "error", { message: "Nonvalid Voting Type", error: "Not a match" }, 500);
            }
            req.user.save();
            foundLevel.save();
            return sendJSON(res, "success", { message: returnMessage, level: foundLevel.getNiceVersion() });
        }
    });
}


module.exports = setLevelVotes;