// Dependencies
var Level = require("../models/level");

module.exports = {
    sendUser: function(req, res, foundUser) {
        foundUser.populate("levels").exec(function (err, foundUser) {
            if (err) {
                sendJSON(res, "error", { message: "Error Finding User", error: err }, 400);
            } else if (foundUser) {
                sendJSON(res, "success",
                    {
                        message: "Successfully found user!",
                        user: foundUser.getNiceVersion()
                    });
            } else {
                sendJSON(res, "error", { message: "No User Found!", error: "User not found" }, 400);
            }
        });
    },
    deleteUser: function(req, res, userDeleteQueryData) {
        userDeleteQueryData.exec(function (err, deletedUser) {
            if (err) {
                sendJSON(res, "error", { message: "Error deleting account", error: err }, 400);
            } else if (!deletedUser) {
                sendJSON(res, "error", { message: "No user found to delete", error: "User not found" }, 400);
            } else {
                // Deletes levels
                Level.deleteMany({ "creator.id": deletedUser._id }, function (err) {
                    if (err) {
                        sendJSON(res, "success", { message: "Deleted User but not levels associated with it", user: deletedUser.getNiceVersion() });
                    } else {
                        // Remove votes from levels
                        Level.updateMany({ "meta.likes": deletedUser._id },
                        { $pull: { "meta.likes": deletedUser._id } },
                        function (err) {
                            if (err) {
                                sendJSON(res, "error", { message: "Error finding voted levels", error: err }, 400);
                            } else {
                                sendJSON(res, "success", { message: "Deleted User and associated levels", user: deletedUser.getNiceVersion() });
                            }
                        });
                    }
                });
            }
        });
    }
}