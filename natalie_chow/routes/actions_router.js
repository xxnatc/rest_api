const express = require('express');
const jsonParser = require('body-parser').json();

const dbErrorHandler = require(__dirname + '/../lib/db_error_handler');
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
    console.log(values);
    res.status(200).json({
      townsPopulation: values[0],
      mafiasPopulation: values[1],
      totalPopulation: values[0] + values[1]
    });
  });
});
