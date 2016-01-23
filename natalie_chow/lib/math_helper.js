// generates a random integer between lower and upper limit, inclusive
var randNum = exports.random = function(lower, upper) {
  return Math.floor(Math.random() * (upper - lower + 1) + lower);
};

exports.randomItem = function(arr) {
  return arr[randNum(0, arr.length - 1)];
};
