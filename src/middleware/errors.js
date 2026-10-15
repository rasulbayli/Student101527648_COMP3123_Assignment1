const { log } = require('../utils/logger');

function notFound(req, res) { res.status(404).json({ error: 'Route not found' }); }
function errorHandler(err, req, res, next) {
  log('error', 'Request failed', { path: req.path, method: req.method, message: err.message });
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) return res.status(400).json({ error: 'Invalid JSON request body' });
  if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid identifier' });
  if (err.code === 11000) return res.status(409).json({ error: 'Username or email already exists' });
  if (err.name === 'ValidationError') return res.status(400).json({ error: 'Validation failed', details: Object.values(err.errors).map(e => e.message) });
  res.status(err.status || 500).json({ error: err.status ? err.message : 'Internal server error' });
}
module.exports = { notFound, errorHandler };
