const jwt = require('jsonwebtoken');
const User = require(__dirname + '/../models/user');
const dbErrorHandler = require(__dirname + '/db_error_handler');

module.exports = exports = function(req, res, next) {
  var decoded;
  try {
    decoded = jwt.verify(req.headers.token, process.env.APP_SECRET || 'mysecretkey');
  } catch(e) {
    return res.status(401).json({ msg: 'invalid token' });
  }

  User.findOne({ _id: decoded.id }, (err, user) => {
    if (err) return dbErrorHandler(err, res);
    if (!user) return res.status(401).json({ msg: 'user does not exist' });

    req.user = user;
    next();
  })
};
