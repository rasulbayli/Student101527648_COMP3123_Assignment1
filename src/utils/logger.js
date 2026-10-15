const fs = require('fs');
const path = require('path');

// Vercel's deployment bundle is read-only; /tmp is writable but ephemeral there.
const logDir = process.env.VERCEL ? path.join('/tmp', 'logs') : path.join(process.cwd(), 'logs');
fs.mkdirSync(logDir, { recursive: true });
const stream = fs.createWriteStream(path.join(logDir, 'app.log'), { flags: 'a' });

function log(level, message, meta = {}) {
  const record = JSON.stringify({ timestamp: new Date().toISOString(), level, message, ...meta }) + '\n';
  stream.write(record);
  if (level === 'error') console.error(record.trim());
  else console.log(record.trim());
}

module.exports = { log, stream };
