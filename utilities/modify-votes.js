
var Level   = require("../models/level"),
    sendJSON= require("../utilities/send-json");

function setLevelVotes(req, res, voteKey) {
    Level.findById(req.params.levelid, function (err, foundLevel) {

        // Error / null user catching
        if (err) {
            return sendJSON(res, "error", { message: "Error finding level to vote!", error: err }, 400);
        } else if (!foundLevel) {
            return sendJSON(res, "error", { message: "No level found to vote!", error: "Level not found" }, 400);
        }
    
    
        // Remove votes from foundLevel
        var levelMeta = foundLevel.meta;
        function levelVotes(userId) {
            return !userId.equals(req.user._id);
        };
        foundLevel.meta.likes = levelMeta.likes.filter(levelVotes);
        foundLevel.meta.dislikes = levelMeta.dislikes.filter(levelVotes);
        
        // Now remove votes from own array
        var userMeta = req.user.meta;
        function filterMyVotes(levelId) {
            return !levelId.equals(foundLevel._id);
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
    });
}


module.exports = setLevelVotes;