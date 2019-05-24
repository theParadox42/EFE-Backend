var mongoose = require("mongoose");
var express = require("express");
var app = express();

mongoose.connect("mongodb+srv://public:123@cluster0-baim8.gcp.mongodb.net/community_levels?retryWrites=true", 
    {
        useNewUrlParser: true
    }
)

var Schema = mongoose.Schema;

var levelSchema = new Schema({
    map: String,
    level: [String],
    creator: String,
    difficulty: Number
})
var Level = mongoose.model("Level", levelSchema);

app.get("/levels", function(req, res){
    Level.find({}, function(err, levels){
        if(err) {
            console.log("Error Getting Levels: " + err);
            res.send("Error");
        } else {
            res.send(JSON.stringify(levels));
        }
    })
});

/*
var level1 = new Level({
    map: "____^___^^^____###^",
    creator: "theParadox42",
    difficulty: 1
})

level1.save(function(err){
    console.log("it worked!")
    console.log(err);
    console.log(Level.find());
});
*/

app.listen(process.env.PORT || 8080, process.env.IP, function(){
    console.log("API Started");
})