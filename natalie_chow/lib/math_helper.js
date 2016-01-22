// generates a random integer between lower and upper limit, inclusive
exports.random = function(lower, upper) {
  return Math.floor(Math.random() * (upper - lower + 1) + lower);
};
