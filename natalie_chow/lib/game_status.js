const dbErrorHandler = require(__dirname + '/db_error_handler');
const Town = require(__dirname + '/../models/town');
const Mafia = require(__dirname + '/../models/mafia');

module.exports = exports = (res) => {
  var readTowns = new Promise((resolve) => {
    Town.find({}, (err, data) => {
      if (err) return dbErrorHandler(err, res);
      resolve(data);
    });
  });

  var readMafias = new Promise((resolve) => {
    Mafia.find({}, (err, data) => {
      if (err) return dbErrorHandler(err, res);
      resolve(data);
    });
  });

  return new Promise((resolve, reject) => {
    Promise.all([readTowns, readMafias]).then((values) => {
      // continue to lynching only if at least 1 character remains in each team
      if (values[0].length && values[1].length) return resolve(values);
      // reject if either team's population is 0
      return reject(values);
    });
  });
};
