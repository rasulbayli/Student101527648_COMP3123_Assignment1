const mongoose = require('mongoose');

async function connectDatabase(uri = process.env.MONGODB_URI) {
  if (!uri) throw new Error('MONGODB_URI is required');
  await mongoose.connect(uri, { dbName: 'comp3123_assignment1' });
  console.log('MongoDB connected: comp3123_assignment1');
}

module.exports = { connectDatabase };
