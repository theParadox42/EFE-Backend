
function validateArray(arr, minValue){
    return typeof arr == "object" &&
        typeof arr.length == "number" &&
        arr.length >= (minValue || 0);
}

function validateObject(obj, requiredComponents) {
    var validated = typeof obj == "object";

    if (validated && typeof requiredComponents == "object") {
        requiredComponents.forEach(element => {
            if(typeof obj[element] == "undefined") validated = false;
        });
    }

    return validated;
}

function validateArrayOfPositionalObjects(arr) {
    if(!validateArray(arr)) return [];

    var validated = arr;
    arr.forEach(positionalObject => {
        if(!validateObject(positionalObject, ["x", "y", "size"])) validated = false;
    })

    return validated;
}

module.exports = function(body){

    if (typeof body != "object" ||
        typeof body.title != "string" || 
        typeof body.type != "string") return null;

    var newLevel = {
        title: body.title,
        type: body.type,
        creator: body.creator,
        difficulty: Math.min(Math.max(parseInt(body.difficulty), 1), 5) || 1,
        published: body.published || false,
        levelData: {}
    };

    var levelData = body.levelData;
    if(!validateObject(levelData)) return null;

    switch(body.type) {
        case "run":
            if (!levelData.map ||
                typeof levelData.map != "string" ||
                levelData.map.length < 1) return null;
            newLevel.levelData.map = levelData.map;
        break;
        case "build":
            // Basic stuff
            if(!validateArray(levelData.map, 1)) return null;
            
            // Check individual lines
            var arrayCheck = false;
            levelData.map.forEach(element => {
                if(typeof element != "string" || element.length < 1) arrayCheck = true;
            });
            if(arrayCheck) return null;
            newLevel.levelData.map = [];
            levelData.map.forEach(element => {
                newLevel.levelData.map.push(element);
            });
        break;
        case "space":
            
            if (!validateObject(levelData.objects) || 
                typeof levelData.width != "number" ||
                levelData.width < 1) return null;
            
            var asteroidArray = validateArrayOfPositionalObjects(levelData.objects.asteroids);
            var ufoArray = validateArrayOfPositionalObjects(levelData.objects.ufos);
            var bossArray = validateArrayOfPositionalObjects(levelData.objects.bosses);
            
            if(!(asteroidArray && ufoArray && bossArray)) return null;

            newLevel.levelData = {
                width: levelData.width,
                objects: {
                    asteroids: asteroidArray,
                    ufos: ufoArray,
                    bosses: bossArray
                }
            }
        break;
        case "mars": 
            var blocksArray = validateArrayOfPositionalObjects(levelData.blocks);
            if(!blocksArray) return null;
            newLevel.levelData.blocks = blocksArray;
        break;
        default:
            return null;
    }

    return newLevel;
}
