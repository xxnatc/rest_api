const express = require('express');
const jsonParser = require('body-parser').json();
const dbErrorHandler = require(__dirname + '/../lib/db_error_handler');
const jwtAuth = require(__dirname + '/../lib/jwt_auth');

const User = require(__dirname + '/../models/user');
var userRouter = module.exports = exports = express.Router();

userRouter.get('/currentuser', jwtAuth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, data) => {
    if (err) return dbErrorHandler(err, res);

    res.json({ username: data.username });
  });
});
