// Dependencies
var _ = require("dotenv").config();
    express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    mongooseConfig  = require("./utilities/mongoose-config"),
    bodyParser      = require("body-parser"),
    Level           = require("./models/level"),
    User            = require("./models/user");

// Mongoose
mongoose.connect(mongooseConfig.string, mongooseConfig.constructor);

// CORS
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended:true }));

// Get
app.get("/", function(req, res){ 
    res.send("")
})
app.get("/levels", function(req, res){
    Level.find({}, function(err, levels){
        if(err) {
            console.log("Error Getting Levels: " + err);
            res.status(400).send("Error");
        } else {
            res.status(200).send(levels);
        }
    })
});
app.get("*", function(req, res) {
    res.send("404, Path Not Registered");
});
// Post
app.post("/levels/new", function(req, res){
    var b = req.body;
    var newLevel = {
        title: b.title || "Untitled Level",
        objects: b.objects || {},
        type: b.type || "null",
        map: b.map || "",
        level: b.level || [],
        creator: b.creator || "Anonymous",
        difficulty: Math.min(Math.max(b.difficulty||1,1),10)
    }
    if(b._id){
        // Check if should update
        Level.find({ _id: b._id }, function(err, levels){
            if(err) {
                res.status(400)
                return;
            }
            if(!levels.length){
                Level.create(newLevel, function(err, newLvl){
                    if(err){
                        console.warn("Error adding level")
                        console.warn(err);
                    } else {
                        res.send(newLvl);
                    }
                });
            } else {
                Level.updateOne({_id:b._id}, {$set: newLevel}, function(err, updatedLevel){
                    if(err){
                        console.warn("Error Updating Level")
                        console.warn(err);
                    } else {
                        res.send(updatedLevel);
                    }
                });
            }
        });
    } else {
        Level.create(newLevel, function(err, newLvl){
            if(err){
                console.warn("Error adding level")
                console.warn(err);
            } else {
                res.send(newLvl);
            }
        });
    }
});

//=================
//==== RUN APP ====
//=================
var app_port = process.env.PORT || 8080;
app.listen(app_port, process.env.IP, function(){
    console.log("API app started on port "+app_port);
});