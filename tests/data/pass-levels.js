
// A bunch of levels that should pass
var runLevel = {
    title: "Epic Run Level Test",
    type: "run",
    difficulty: 1,
    levelData: {
        map: "_____xx___cc_____^^^___l"
    }
};

var buildLevel = {
    title: "Epic Platformer Level Test",
    type: "build",
    difficulty: 2,
    levelData: {
        map: [
            "__________________________________________________",
            "__________________________________________________",
            "__________________________________________________",
            "__________________________________________________",
            "__________________________________________________",
            "__________________________________________________",
            "___________________#________________________%p____",
            "___________________#________________________pp____",
            "@_______^^________##^__#xxxx#_______^_______##____",
            "##################################################"
        ]
    }
}

var spaceLevel = {
    title: "Epic Space Level Test",
    type: "space",
    difficulty: 3,
    levelData: {
        width: 500,
        objects: {
            /* asteroids: [
                {
                    x: 120,
                    y: 40,
                    size: 25
                }
            ], */
            ufos: [
                {
                    x: 120,
                    y: 40,
                    size: 25
                }
            ],
            boss: [
                {
                    x: 60,
                    y: 40,
                    size: 25
                }
            ]
        }
    }
};

var marsLevel = {
    title: "Epic Mars Level Test",
    type: "mars",
    difficulty: 4,
    levelData: {
        blocks: [
            {
                x: 50,
                y: 50,
                size: 25
            }
        ]
    }
};

// Confined into an array
module.exports = [runLevel, buildLevel, spaceLevel, marsLevel];