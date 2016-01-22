const mongoose = require('mongoose');
const mathHelper = require(__dirname + '/../lib/math_helper');

var mafiaSchema = new mongoose.Schema({
  name: String,
  age: Number,
  skill: {
    type: Number,
    min: 0,
    max: 100,
    default: mathHelper.random(0, 100)
  },
  weaponOfChoice: String,
  rank: {
    type: String,
    default: 'average mobster'
  }
});

module.exports = exports = mongoose.model('Mafia', mafiaSchema);
