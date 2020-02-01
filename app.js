// Dependencies
var _ = require("dotenv").config();
    express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    mongooseConfig  = require("./utilities/mongoose-config"),
    allowCrossDomain= require("./middleware/bad-security"),
    bodyParser      = require("body-parser"),
    levelRoutes     = require("./routes/levels");

// Mongoose
mongoose.connect(mongooseConfig.string, mongooseConfig.constructor);

// CORS
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended:true }));

// Routes
app.use("/levels", levelRoutes);


//=================
//==== RUN APP ====
//=================
var app_port = process.env.PORT || 8080;
app.listen(app_port, process.env.IP, function(){
    console.log("API app started on port "+app_port);
});