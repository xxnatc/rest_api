const mathHelper = require(__dirname + '/math_helper');
const dbErrorHandler = require(__dirname + '/db_error_handler');

const Town = require(__dirname + '/../models/town');
const Mafia = require(__dirname + '/../models/mafia');

module.exports = exports = (values, res) => {
  var towns = values[0];
  var mafias = values[1];

  res.status(200).json({ msg: 'night is coming' });
};
