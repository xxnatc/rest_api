const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
  username: String,
  auth: {
    email: String,
    password: String
  }
});

userSchema.methods.hashPassword = function(password) {
  return bcrypt.hashSync(password, 8);
};

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.auth.password);
};

userSchema.methods.generateToken = function() {
  return jwt.sign({ id: this._id }, process.env.APP_SECRET || 'mysecretkey');
};

module.exports = exports = mongoose.model('User', userSchema);
