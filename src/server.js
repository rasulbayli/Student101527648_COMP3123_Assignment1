require('dotenv').config();
const app = require('./app');
const { connectDatabase } = require('./config/db');
const { log } = require('./utils/logger');

const port = process.env.PORT || 3000;
async function start() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be at least 32 characters');
  if (process.env.MONGODB_URI) await connectDatabase();
  else if (process.env.NODE_ENV !== 'test') throw new Error('MONGODB_URI is required');
  app.listen(port, () => log('info', 'Server started', { port }));
}
if (require.main === module) start().catch(err => { log('error', 'Startup failed', { message: err.message }); process.exit(1); });
module.exports = { start };
