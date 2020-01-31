
function validateArray(arr, minValue){
    return typeof arr == "object" &&
        typeof arr.length == "number" &&
        arr.length >= (minValue || 0);
}

function validateObject(obj, requiredComponents) {
    var validated = typeof obj == "object";
    if(validated) {
        requiredComponents.forEach(element => {
            if(typeof obj[element] == "undefined") validated = false;
        });
    }

    return validated;
}

module.exports = function(body){

    if (typeof body != "object" ||
        typeof body.title != "string" || 
        typeof body.type != "string" ||
        typeof body.creator != "string") return null;
    
    var newLevel = {
        title: body.title,
        type: body.type,
        creator: body.creator,
        difficulty: Math.min(Math.max(parseInt(body.difficulty), 1), 5)
    };
    
    switch(body.type) {
        case "run":
            if(!body.map) return null;
            if(typeof body.map != "string") return null;
            if(body.map.length < 1) return null;
            newLevel.map = body.map;
        break;
        case "build":
            // Basic stuff
            if(!validateArray(body.level, 1)) return null;
            // Check individual lines
            var arrayCheck = false;
            body.level.forEach(element => {
                if(typeof element != "string" || element.length > 1) arrayCheck = true;
            });
            if(arrayCheck) return null;
            newLevel.level = [];
            body.level.forEach(element => {
                newLevel.level.push(element);
            });
        break;
        case "space":
            if (!validateObject(body.objects, ["width"]) || 
                typeof body.objects.width != "number" || body.objects.width > 0 ||
                !validateArray(body.objects.asteroids) || !validateArray(body.objects.ufos)) return null;
            newLevel.level = {
                width: body.objects.width,
                asteroids: validateArray(body.objects.asteroids) ? body.objects.asteroids : [],
                ufos: validateArray(body.objects.ufos) ? body.objects.ufos : [],
                bosses: validateArray(body.objects.bosses) ? body.objects.bosses : []
            }
        break;
        case "mars": 
            if (!validateObject(body.objects, ["blocks"]) ||
                !validateArray(body.objects.blocks)) return null;
            newLevel.level = {
                blocks: validateArray(body.objects.blocks) ? body.objects.blocks : []
            };
        break;
        default:
            return null;
    }

    return newLevel;
}
