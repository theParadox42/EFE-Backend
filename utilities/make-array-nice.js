module.exports = function(arr) {
    var newArr = [];
    arr.forEach(doc => {
        if(typeof doc.getNiceVersion == "function") {
            newArr.push(doc.getNiceVersion());
        }
    });
    return newArr;
}