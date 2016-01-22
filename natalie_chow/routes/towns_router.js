const express = require('express');
const jsonParser = require('body-parser').json();

const dbErrorHandler = require(__dirname + '/../lib/db_error_handler');
const Town = require(__dirname + '/../models/town');

var townsRouter = module.exports = exports = express.Router();

townsRouter.get('/towns/:id', (req, res) => {
  Town.find({_id: req.params.id}, (err, data) => {
    if (err) return dbErrorHandler(err, res);
    res.status(200).json(data);
  });
});

townsRouter.get('/towns', (req, res) => {
  Town.find({}, (err, data) => {
    if (err) return dbErrorHandler(err, res);
    res.status(200).json(data);
  });
});

townsRouter.post('/towns', jsonParser, (req, res) => {
  var newTown = new Town(req.body);
  newTown.save((err, data) => {
    if (err) return dbErrorHandler(err, res);
    res.status(200).json(data);
  });
});

townsRouter.put('/towns/:id', jsonParser, (req, res) => {
  var townData = req.body;
  delete townData._id;

  Town.update({ _id: req.params.id }, townData, (err) => {
    if (err) return dbErrorHandler(err, res);
    res.status(200).json({ msg: 'update successful'});
  });
});

townsRouter.delete('/towns/:id', (req, res) => {
  Town.remove({ _id: req.params.id }, (err) => {
    if (err) return dbErrorHandler(err, res);
    res.status(200).json({ msg: 'delete successful'});
  });
});
