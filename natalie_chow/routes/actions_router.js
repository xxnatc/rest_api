const express = require('express');

const dbErrorHandler = require(__dirname + '/../lib/db_error_handler');
const generateChar = require(__dirname + '/../lib/generate_characters');

const Town = require(__dirname + '/../models/town');
const Mafia = require(__dirname + '/../models/mafia');
var actionsHelper = require(__dirname + '/../lib/actions_helper');
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

actionsRouter.get('/wipe', (req, res) => {
  actionsHelper.clearDB(res).then(() => {
    isNight = true;
    res.status(200).json({ msg: 'wipe successful'});
  });
});

actionsRouter.get('/newgame', (req, res) => {
  actionsHelper.clearDB(res).then(() => {
    generateChar().then(() => {
      isNight = true;
      res.status(200).json({ msg: 'new game generation successful'});
    });
  });
});

var isNight = true;

actionsRouter.get('/day', (req, res) => {
  actionsHelper.dayActions(res);
});

actionsRouter.get('/night', (req, res) => {
  actionsHelper.nightActions(res);
});

actionsRouter.get('/next', (req, res) => {
  if (isNight) {
    actionsHelper.nightActions(res);
  } else {
    actionsHelper.dayActions(res);
  }
  isNight = !isNight;
});
