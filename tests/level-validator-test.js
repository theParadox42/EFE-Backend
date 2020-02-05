
var levelValidator  = require("../utilities/validate-level"),
    assert          = require("assert"),
    passData        = require("./data/pass-levels"),
    failData        = require("./data/fail-levels.js");


// Function that runs tests on an array
function runTestsOnArray(title, arr, outcome) {

    describe(title, function() {
        arr.forEach(level => {
            it(level.title, function () {
                // takes the output and turns it into a bool
                var valid = !!levelValidator(level);
                assert.equal(valid, outcome);
            });
        });
    });
};

runTestsOnArray("Passing Level Tests", passData, true);
runTestsOnArray("Failing Level Tests", failData, false)