const mathHelper = require(__dirname + '/math_helper');
const dbErrorHandler = require(__dirname + '/db_error_handler');

const Town = require(__dirname + '/../models/town');
const Mafia = require(__dirname + '/../models/mafia');

var crimeLastNight = false;  // keeps track if a killing happened at night

var calculateActions = (values) => {
  var totalPop = values[0].length + values[1].length;
  var charStatus = [];
  for (var i = 0; i < totalPop; i++) {
    charStatus.push({ count: 0, protectBy: [], attemptBy: [] });
  }

  values[0].forEach((char) => {
    // account for town's willingness to protect someone else
    if (mathHelper.takeAction(char.braveness)) {
      var target = mathHelper.random(0, totalPop - 1);
      charStatus[target].count++;
      charStatus[target].protectBy.push(char);
    }
  });

  values[1].forEach((char) => {
    // account for mafia's skill and environmental factor
    var willAttack = (totalPop < 5) ? mathHelper.chance() < 0.8 : mathHelper.chance() < 0.45;
    if (values[1].length === 1 || (willAttack && mathHelper.takeAction(char.skill))) {
      var target = mathHelper.random(0, totalPop - 1);
      charStatus[target].count--;
      charStatus[target].attemptBy.push(char);
    }
  });

  return charStatus;
};

var handleResults = (charStatus, values, res) => {
  var results = '';
  charStatus.forEach((status, index) => {
    if (status.attemptBy.length) {
      if (status.count < 0) {  // attempted & succeeded
        results += removeChar(values, index, res) + writeKilledBy(status.attemptBy);
      } else {  // attempted but saved by a town
        results += writeSavedBy(values, index, status.protectBy);
      }
    }
  });
  return results || 'No one was killed or attacked tonight.';
};

var removeChar = (values, index, res) => {
  crimeLastNight = true;
  if (index < values[0].length) {  // a town is killed
    Town.remove({ _id: values[0][index]._id }, (err) => {
      if (err) return dbErrorHandler(err, res);
    });
    return `${values[0][index].name} was found dead late last night. ${values[0][index].name} has been a town ${values[0][index].occupation} for many years but `;
  } else {  // a mafia is killed
    index -= values[0].length;
    Mafia.remove({ _id: values[1][index]._id }, (err) => {
      if (err) return dbErrorHandler(err, res);
    });
    return `${values[1][index].name} was found dead at his home. ${values[1][index].name} was discovered to be a ${values[1][index].rank} in the mafia and `;
  }
};

var writeKilledBy = (attempts) => {
  var msg = 'was tragically killed by ';
  if (attempts.length === 1) return msg + attempts[0].weaponOfChoice + '. ';
  for (var i = 0; i < attempts.length - 1; i++) {
    msg += attempts[i].weaponOfChoice + ', ';
  }
  return msg += 'and ' + attempts[attempts.length - 1].weaponOfChoice + '. ';
};

var writeSavedBy = (values, index, protects) => {
  var flattened = values[0].concat(values[1]);
  var msg = `${flattened[index].name} was attacked at his home last night. He was saved by a ${protects[0].occupation}`;
  if (protects.length > 1) {
    for (var i = 1; i < protects.length; i++) {
      msg += ` and a ${protects[i].occupation}`;
    }
  }
  return msg += '. ';
};

module.exports = exports = (values, res) => {
  crimeLastNight = false;
  var charStatus = calculateActions(values);
  var resultMsg = handleResults(charStatus, values, res);
  res.status(200).json({ msg: resultMsg });
  return crimeLastNight;
};
