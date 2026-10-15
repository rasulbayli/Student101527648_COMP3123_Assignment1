const jwt = require('jsonwebtoken');
const { log } = require('../utils/logger');

module.exports = function authenticate(req, res, next) {
  const value = req.get('authorization') || '';
  const match = value.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    log('warn', 'Authorization failure', { path: req.path, reason: 'missing bearer token' });
    return res.status(401).json({ error: 'Authentication required', message: 'Provide Authorization: Bearer <token>.' });
  }
  try {
    req.auth = jwt.verify(match[1], process.env.JWT_SECRET);
    next();
  } catch (err) {
    log('warn', 'Authorization failure', { path: req.path, reason: err.name });
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
