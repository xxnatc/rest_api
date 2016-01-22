const mongoose = require('mongoose');
const mathHelper = require(__dirname + '/../lib/math_helper');

var townSchema = new mongoose.Schema({
  name: String,
  age: Number,
  braveness: {
    type: Number,
    min: 0,
    max: 100,
    default: mathHelper.random(0, 100)
  },
  occupation: {
    type: String,
    default: 'villager'
  }
});

module.exports = exports = mongoose.model('Town', townSchema);
