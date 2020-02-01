
// Some AUTH middleware

var sendJSON    = require("../utilities/send-json"),
    jwt         = require("jsonwebtoken");

function auth(req, res, next) {
    
    // Check if user already exists
    if(req.user) return next();

    const token = req.header('Authorization').replace('Bearer', '').trim();

    const decoded = jwt.verify(token, process.env.SECRET);

    User.findOne({ _id: decoded.id, 'tokens.token': token }, function(err, foundUser) {
        if (err || !user) {
            return sendJSON(res, "error", { message: "Token Invalid", error: err || "User not found" });
        }
        req.token = token;
        req.user = user;
        next();
    });
}

module.exports = auth;
