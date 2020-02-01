
var levelValidator = require("../utilities/validate-level"),
    assert = require("assert");

// A bunch of levels that should pass

var runLevel = {
    title: "Epic Run Level Test",
    type: "run",
    creator: {
        username: "Test",
        _id: "abunchofrandomlettersandnumbers123"
    },
    difficulty: 1,
    levelData: {
        map: "_____xx___cc_____^^^___l"
    }
};

var buildLevel = {
    title: "Epic Platformer Level Test",
    type: "build",
    creator: {
        username: "Test",
        _id: "abunchofrandomlettersandnumbers123"
    },
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
    creator: {
        username: "Test",
        _id: "abunchofrandomlettersandnumbers123"
    },
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
    creator: {
        username: "Test",
        _id: "abunchofrandomlettersandnumbers123"
    },
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

function runTestsOnArray(arr, inverted) {

    arr.forEach(level => {
        it(level.title, function () {
            var valid = levelValidator(level);
            if(inverted) valid = !valid;
            assert.equal(valid && true, true);
        });
    });
}

var passLevels = [runLevel, buildLevel, spaceLevel, marsLevel];
describe("Passable Level Tests", function () {
    runTestsOnArray(passLevels);
});

// A bunch of levels that by failing pass
var typeFailLevel = {
    title: "Yeet",
    type: "FAIL HERE",
    creator: {
        username: "Test",
        _id: "abunchofrandomlettersandnumbers123"
    },
}

var failLevels = [typeFailLevel];
describe("Failure Level Tests", function() {
    runTestsOnArray(failLevels, true);
})