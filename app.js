// Dependencies
var mongoose = require("mongoose");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

// Setup
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb+srv://public:123@cluster0-baim8.gcp.mongodb.net/community_levels?retryWrites=true", { useNewUrlParser: true })

// Mongoose
var Schema = mongoose.Schema;
var levelSchema = new Schema({
    type: String,
    map: String,
    level: [String],
    creator: String,
    difficulty: Number
})
var Level = mongoose.model("Level", levelSchema);

// Get
app.get("/", function(req, res){
    res.redirect("https://escapefromearth.tk")
})
app.get("/levels", function(req, res){
    Level.find({}, function(err, levels){
        if(err) {
            console.log("Error Getting Levels: " + err);
            res.send("Error");
        } else {
            res.send(levels);
        }
    })
});
app.get("/levels/new", function(req, res){
    res.render("newLevel.ejs");
});

// Post
app.post("/levels/new", function(req, res){
    var b = req.body;
    var newLevel = {
        type: b.type||"null",
        map: b.map||"",
        level: b.level||[],
        creator: b.creator||"Anonymous",
        difficulty: Math.min(Math.max(b.difficulty||1,1),10)
    }
    Level.create(newLevel, function(err, newLvl){
        if(err){
            console.log(err);
        } else {
            res.send(newLvl);
        }
    });
});

// Run
var app_port = process.env.PORT || 8080;
app.listen(app_port, process.env.IP, function(){
    console.log("API app started on port "+app_port);
})
