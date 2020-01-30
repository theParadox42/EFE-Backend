
module.exports = function(body){
    if(!body.title || !body.type) return null;
    
    var newLevel = {
        title: body.title,
        type: body.type
    };
    
    switch(body.type) {
        case "runtorocket":
        
    }
