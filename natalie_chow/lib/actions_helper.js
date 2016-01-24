const gameStatus = require(__dirname + '/game_status');
const gameOver = require(__dirname + '/game_over');
const gameDay = require(__dirname + '/game_day');
const gameNight = require(__dirname + '/game_night');
const dbErrorHandler = require(__dirname + '/db_error_handler');

const Town = require(__dirname + '/../models/town');
const Mafia = require(__dirname + '/../models/mafia');

var crimeLastNight = exports.crimeLastNight = false;

exports.dayActions = (res) => {
  gameStatus(res)
    .then((values) => {
      gameDay(crimeLastNight, values, res);
    })
    .catch((values) => {
      gameOver(values, res);
    });
};

exports.nightActions = (res) => {
  gameStatus(res)
    .then((values) => {
      crimeLastNight = gameNight(values, res);
    })
    .catch((values) => {
      gameOver(values, res);
    });
};

exports.clearDB = function(res) {
  var deleteTowns = new Promise((resolve) => {
    Town.remove({}, (err) => {
      if (err) return dbErrorHandler(err, res);
      resolve();
    });
  });

  var deleteMafias = new Promise((resolve) => {
    Mafia.remove({}, (err) => {
      if (err) return dbErrorHandler(err, res);
      resolve();
    });
  });

  return Promise.all([deleteTowns, deleteMafias]);
};
