require('dotenv').config();
const app = require('../src/app');
const mongoose = require('mongoose');
let connection;
module.exports = async (req, res) => {
  if (process.env.MONGODB_URI && mongoose.connection.readyState !== 1) {
    connection ||= mongoose.connect(process.env.MONGODB_URI, { dbName: 'comp3123_assignment1' });
    await connection;
  }
  return app(req, res);
};
