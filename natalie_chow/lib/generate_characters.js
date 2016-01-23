const fs = require('fs');
const mathHelper = require(__dirname + '/math_helper');
const Town = require(__dirname + '/../models/town');
const Mafia = require(__dirname + '/../models/mafia');

var populateDB = (defaultData) => {
  var charTally = [0, 0];

  defaultData.charNames.forEach(function(char) {
    var rand = mathHelper.random(0, 1);
    // make sure no more than 9 characters on each side
    if (charTally[rand] === 9) rand = ~rand + 2;

    if (rand) {
      Town.create({
        name: char,
        age: mathHelper.random(10, 80),
        braveness: mathHelper.random(0, 100),
        occupation: mathHelper.randomItem(defaultData.occupations)
      });
    } else {
      Mafia.create({
        name: char,
        age: mathHelper.random(10, 80),
        skill: mathHelper.random(0, 100),
        weaponOfChoice: mathHelper.randomItem(defaultData.weapons),
        rank: mathHelper.randomItem(defaultData.ranks)
      });
    }
    charTally[rand]++;
  });
};

module.exports = exports = () => {
  var loadData = new Promise((resolve) => {
    fs.readFile(__dirname + '/../data/default_data.json', (err, data) => {
      return resolve(JSON.parse(data.toString()));
    });
  });
  return loadData.then(populateDB);
};
