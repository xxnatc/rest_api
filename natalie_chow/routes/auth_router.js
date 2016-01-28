const express = require('express');
const jsonParser = require('body-parser').json();
const dbErrorHandler = require(__dirname + '/../lib/db_error_handler');
const basicHTTP = require(__dirname + '/../lib/basic_http');
const validSignup = require(__dirname + '/../lib/valid_signup');

const User = require(__dirname + '/../models/user');
var authRouter = module.exports = exports = express.Router();

authRouter.post('/signup', jsonParser, validSignup, (req, res) => {
  var newUser = new User();
  newUser.username = req.body.username || req.body.email;
  newUser.auth.email = req.body.email;
  newUser.auth.password = newUser.hashPassword(req.body.password);
  newUser.save((err, data) => {
    if (err) return dbErrorHandler(err, res);
    res.status(200).json({ token: data.generateToken() });
  });
});

authRouter.get('/signin', basicHTTP, (req, res) => {
  User.findOne({ 'auth.email': req.basicHTTP.email }, (err, data) => {
    if (err) return dbErrorHandler(err, res);
    if (!data) return res.status(401).json({ msg: 'user does not exist' });

    if (!data.comparePassword(req.basicHTTP.password))
      return res.status(401).json({ msg: 'invalid password' });

    res.json({ token: data.generateToken() });
  });
})
