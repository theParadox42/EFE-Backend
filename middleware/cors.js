var cors = require("cors");

var allowedOrigins = process.env.ACCESS_CONTROL_ALLOW_ORIGIN.split(",");

module.exports = cors({
    origin: function (origin, callback) {
        // If the ALLOW_CONTROL_ACCESS_ORIGIN is empty or allows everyone
        if (typeof allowedOrigins != "object" || allowedOrigins.length == 0 || allowedOrigins[0] == "*") {
            return callback(null, true);
        }
        // Allows mobile apps
        if (!origin) return callback(null, true);
        // Checks other websites
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = "The CORS policy for this site does not allow access from the specified Origin.";
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
});