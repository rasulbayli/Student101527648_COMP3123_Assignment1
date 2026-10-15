const { validationResult } = require('express-validator');
const { log } = require('../utils/logger');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const details = errors.array().map(({ path, msg }) => ({ field: path, message: msg }));
  log('warn', 'Validation failure', { path: req.path, fields: details.map(e => e.field) });
  res.status(400).json({ error: 'Validation failed', details });
};
