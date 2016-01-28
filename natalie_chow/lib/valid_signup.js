const User = require(__dirname + '/../models/user');
const dbErrorHandler = require(__dirname + '/../lib/db_error_handler');

module.exports = exports = function(req, res, next) {
  // check valid input
  if (!req.body.email || !(req.body.password || '').length > 7)
    return res.status(400).json({ msg: 'invalid username or password' });

  // check unique username/email
  var usernameInput = req.body.username || req.body.email;
  User.find({ username: usernameInput }, (err, data) => {
    if (err) return dbErrorHandler(err, res);
    if (data.length) return res.status(400).json({ msg: 'username taken' });
    next();
  });
};
