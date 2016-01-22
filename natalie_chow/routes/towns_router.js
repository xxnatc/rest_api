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
