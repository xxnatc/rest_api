const mathHelper = require(__dirname + '/math_helper');
const dbErrorHandler = require(__dirname + '/db_error_handler');

const Town = require(__dirname + '/../models/town');
const Mafia = require(__dirname + '/../models/mafia');

module.exports = exports = (crimeLastNight, values, res) => {
  if (!crimeLastNight) return res.status(200).json({ msg: 'No one is voted to be lynched.' });

  var towns = values[0];
  var mafias = values[1];
  var index = mathHelper.random(0, towns.length + mafias.length - 1);
  if (index < towns.length) {  // a town will to be lynched
    Town.remove({ _id: towns[index]._id }, (err) => {
      if (err) return dbErrorHandler(err, res);
      res.status(200).json({ msg: `Town of Salem voted for ${towns[index].name} to be lynched. ${towns[index].age}-year-old ${towns[index].name} was a town ${towns[index].occupation}.`});
    });
  } else {  // a mafia will be lynched
    index -= towns.length;
    Mafia.remove({ _id: mafias[index]._id }, (err) => {
      if (err) return dbErrorHandler(err, res);
      res.status(200).json({ msg: `Town of Salem voted for ${mafias[index].name} to be guilty. ${mafias[index].age}-year-old ${mafias[index].name} was a ${mafias[index].rank} in the mafia.`});
    });
  }
};
