//==================
//== Dependencies ==
//==================
var _               = require("dotenv").config(),
    express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    mongooseConfig  = require("./config/mongoose"),
    levelRoutes     = require("./routes/levels"),
    authRoutes      = require("./routes/users"),
    indexRoutes     = require("./routes/index"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local").Strategy,
    BearerStrategy  = require("passport-http-bearer").Strategy,
    bearerConfig    = require("./config/passport-bearer"),
    User            = require("./models/user"),
    allowCrossDomain= require("./middleware/cors"),
    bodyParser      = require("body-parser");

// Mongoose
mongoose.connect(mongooseConfig.string, mongooseConfig.constructor);

// Passport Setup
app.use(passport.initialize())
passport.use(new LocalStrategy(User.authenticate()));
passport.use(new BearerStrategy(bearerConfig))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Temporay CORS Fix
app.use(allowCrossDomain);

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));

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