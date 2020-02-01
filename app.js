//==================
//== Dependencies ==
//==================
var _               = require("dotenv").config(),
    express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    mongooseConfig  = require("./utilities/mongoose-config"),
    User            = require("./models/user"),
    levelRoutes     = require("./routes/levels"),
    authRoutes      = require("./routes/users"),
    indexRoutes     = require("./routes/index"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local").Strategy,
    BearerStrategy  = require("passport-http-bearer").Strategy,
    jwt             = require("jsonwebtoken"),
    allowCrossDomain= require("./middleware/bad-security"),
    bodyParser      = require("body-parser");

// Mongoose
mongoose.connect(mongooseConfig.string, mongooseConfig.constructor);

// Passport Setup
app.use(passport.initialize())
passport.use(new LocalStrategy(User.authenticate()));
passport.use(new BearerStrategy(function (token, done) {

    console.log("okay");

    var decoded = jwt.verify(token, process.env.SECRET);

    User.findOne({ _id: decoded.id, "tokens.token": token }, function (err, foundUser) {
        if (err) return done(err);
        if (!user) return done(null, false);
        return done(null, foundUser, { scope: "all" });
    });
    
}))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use(function (req, res, next) {
//     res.locals.user = req.user;
//     next();
// });

// Temporaray CORS Fix
app.use(allowCrossDomain);

// Body Parser
app.use(bodyParser.urlencoded({ extended:true }));

// Routes
app.use(authRoutes);
app.use("/levels", levelRoutes);
app.use(indexRoutes);


//=================
//==== RUN APP ====
//=================
var appPort = process.env.PORT || 8080;
app.listen(appPort, process.env.IP, function(){
    console.log(`API app started on port ${appPort}`);
});