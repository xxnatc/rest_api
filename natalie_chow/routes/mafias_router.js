const express = require('express');
const jsonParser = require('body-parser').json();

const dbErrorHandler = require(__dirname + '/../lib/db_error_handler');
const Mafia = require(__dirname + '/../models/mafia');

var mafiasRouter = module.exports = exports = express.Router();

mafiasRouter.get('/mafias/:id', (req, res) => {
  Mafia.find({_id: req.params.id}, (err, data) => {
    if (err) return dbErrorHandler(err, res);
    res.status(200).json(data);
  });
});

mafiasRouter.get('/mafias', (req, res) => {
  Mafia.find({}, (err, data) => {
    if (err) return dbErrorHandler(err, res);
    res.status(200).json(data);
  });
});

mafiasRouter.post('/mafias', jsonParser, (req, res) => {
  var newMafia = new Mafia(req.body);
  newMafia.save((err, data) => {
    if (err) return dbErrorHandler(err, res);
    res.status(200).json(data);
  });
});

mafiasRouter.put('/mafias/:id', jsonParser, (req, res) => {
  var mafiaData = req.body;
  delete mafiaData._id;

  Mafia.update({ _id: req.params.id }, mafiaData, (err) => {
    if (err) return dbErrorHandler(err, res);
    res.status(200).json({ msg: 'update successful'});
  });
});

mafiasRouter.delete('/mafias/:id', (req, res) => {
  Mafia.remove({ _id: req.params.id }, (err) => {
    if (err) return dbErrorHandler(err, res);
    res.status(200).json({ msg: 'delete successful'});
  });
});
