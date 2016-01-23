// generates a random integer between lower and upper limit, inclusive
var randNum = exports.random = (lower, upper) => {
  return Math.floor(Math.random() * (upper - lower + 1) + lower);
};

exports.randomItem = (arr) => {
  return arr[randNum(0, arr.length - 1)];
};

exports.takeAction = (level) => {
  return level >= randNum(0, 100);
};

exports.chance = () => {
  return Math.random();
};
