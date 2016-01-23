const express = require('express');

const dbErrorHandler = require(__dirname + '/../lib/db_error_handler');
const generateChar = require(__dirname + '/../lib/generate_characters');
const gameStatus = require(__dirname + '/../lib/game_status');
const gameOver = require(__dirname + '/../lib/game_over');
const gameDay = require(__dirname + '/../lib/game_day');
const gameNight = require(__dirname + '/../lib/game_night');

const Town = require(__dirname + '/../models/town');
const Mafia = require(__dirname + '/../models/mafia');

var actionsRouter = module.exports = exports = express.Router();

actionsRouter.get('/census', (req, res) => {
  var readTowns = new Promise((resolve) => {
    Town.find({}, (err, data) => {
      if (err) return dbErrorHandler(err, res);
      resolve(data.length);
    });
  });

  var readMafias = new Promise((resolve) => {
    Mafia.find({}, (err, data) => {
      if (err) return dbErrorHandler(err, res);
      resolve(data.length);
    });
  });

  Promise.all([readTowns, readMafias]).then((values) => {
    res.status(200).json({
      towns: values[0],
      mafias: values[1],
      totalPopulation: values[0] + values[1]
    });
  });
});

var clearDB = function(res) {
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

actionsRouter.get('/wipe', (req, res) => {
  clearDB(res).then(() => {
    res.status(200).json({ msg: 'wipe successful'});
  });
});

actionsRouter.get('/newgame', (req, res) => {
  clearDB(res).then(() => {
    generateChar().then(() => {
      res.status(200).json({ msg: 'new game generation successful'});
    });
  });
});

actionsRouter.get('/day', (req, res) => {
  gameStatus()
    .then((values) => {
      gameDay(values, res);
    })
    .catch((values) => {
      gameOver(values, res);
    });
});

actionsRouter.get('/night', (req, res) => {
  gameStatus()
    .then((values) => {
      gameNight(values, res);
    })
    .catch((values) => {
      gameOver(values, res);
    });
});
